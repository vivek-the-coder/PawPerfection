import { stripe } from "../utils/payment.js"
import { sendPaymentConfirmationEmail } from "../utils/emailService.js"
import prisma from '../db/prisma.js';

if (!stripe) {
    throw new Error("Stripe is not defined")
}

export const createPayment = async (req, res) => {
    try {
        const { price, trainingProgramId } = req.body
        const idempotencyKey = req.headers['idempotency-key'];

        // Validate required fields
        if (!price || !trainingProgramId) {
            return res.status(400).json({
                msg: "Price and training program id are required",
                success: false
            })
        }

        // Validate price is a positive number
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({
                msg: "Price must be a positive number",
                success: false
            })
        }

        // Check if training program exists
        const trainingProgram = await prisma.training.findUnique({ where: { id: trainingProgramId } });
        if (!trainingProgram) {
            return res.status(404).json({
                msg: "Training program not found",
                success: false
            })
        }

        // Ensure absolute URLs for Stripe redirect (must include scheme)
        const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const frontendUrl = rawFrontendUrl.startsWith('http://') || rawFrontendUrl.startsWith('https://')
            ? rawFrontendUrl
            : `http://${rawFrontendUrl}`;

        // Check if user has already purchased this course
        const userId = req.user.id || req.user._id;

        const existingPurchase = await prisma.payment.findFirst({
            where: {
                userId: userId,
                trainingProgramId: trainingProgramId,
                status: 'completed'
            }
        });

        if (existingPurchase) {
            return res.status(400).json({
                msg: "You have already purchased this training program",
                success: false,
                data: {
                    paymentId: existingPurchase.id,
                    purchased: true
                }
            });
        }

        // Check for idempotency key collision
        if (idempotencyKey) {
            const existingPayment = await prisma.payment.findFirst({
                where: {
                    idempotencyKey: idempotencyKey,
                    userId: userId
                }
            });
            if (existingPayment) {
                console.log('Idempotency hit: Returning existing payment', existingPayment.id);
                // If we have a session ID, we could verify it's still valid, but for now return existing data
                return res.status(200).json({
                    msg: "Payment already exists (Idempotent)",
                    success: true,
                    data: {
                        paymentId: existingPayment.id,
                        sessionId: existingPayment.paymentId !== 'pending' ? existingPayment.paymentId : undefined,
                    }
                });
            }
        }

        // Create payment record
        const payment = await prisma.payment.create({
            data: {
                price,
                trainingProgramId,
                userId: userId,
                paymentId: "pending",
                status: "pending",
                paymentOrderId: "pending",
                paymentMethod: "card",
                paymentStatus: "pending",
                paymentCurrency: "INR",
                idempotencyKey: idempotencyKey || undefined // Explicitly undefined if null/empty to avoid unique constraint if schema allows nulls but we want to be safe
            }
        })

        // Create Stripe checkout session
        console.log('Creating Stripe session with:', {
            price: price,
            trainingProgramTitle: trainingProgram.title,
            frontendUrl: frontendUrl,
            userEmail: req.user.email
        });

        let session;
        try {
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `Training Program - ${trainingProgram.title}`,
                            description: `Dog training course enrollment - Week ${trainingProgram.week || 1}`
                        },
                        unit_amount: Math.round(price * 100), // Convert to paise and ensure integer
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${frontendUrl}/payment/cancel`,
                metadata: {
                    paymentId: payment.id,
                    userId: userId,
                    trainingProgramId: trainingProgramId
                },
                customer_email: req.user.email,
                expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes from now
                allow_promotion_codes: true,
                billing_address_collection: 'auto'
            }, {
                idempotencyKey: idempotencyKey
            });
        } catch (stripeError) {
            console.error('Stripe session creation failed:', stripeError);
            throw new Error(`Stripe error: ${stripeError.message}`);
        }

        console.log('Stripe session created:', {
            id: session.id,
            url: session.url,
            status: session.status
        });

        // Ensure session URL exists
        if (!session || !session.url) {
            console.error('Stripe session created but no URL returned:', session);
            throw new Error('Failed to create Stripe checkout session - no URL returned');
        }

        // Update payment record with session details
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                paymentOrderId: session.id,
                paymentId: session.id
            }
        })

        return res.status(201).json({
            msg: "Payment created successfully",
            success: true,
            data: {
                paymentId: payment.id,
                sessionId: session.id,
                url: session.url
            }
        })
    }
    catch (error) {
        console.error("Payment creation error:", error);
        return res.status(500).json({
            msg: "Failed to create payment",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

export const getPayment = async (req, res) => {
    try {
        const { paymentId } = req.params

        if (!paymentId) {
            return res.status(400).json({
                msg: "Payment ID is required",
                success: false
            })
        }

        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                user: true, // Need to select partial fields ideally, but prisma returns whole obj.
                training: true
            }
        });

        if (!payment) {
            return res.status(404).json({
                msg: "Payment not found",
                success: false
            })
        }

        // Check if user is authorized to view this payment
        const userId = req.user.id || req.user._id;
        if (payment.userId !== userId) {
            return res.status(403).json({
                msg: "Unauthorized to view this payment",
                success: false
            })
        }

        // Filter out sensitive user data manually if needed or just return relevant parts
        // Mapping to match previous response structure if possible
        const userMin = { name: payment.user.name, email: payment.user.email };
        const trainingMin = {
            title: payment.training.title,
            week: payment.training.week,
            description: payment.training.description || "", // Check schema for description
            price: payment.training.price
        };

        // Construct response object resembling populate result
        const responseData = {
            ...payment,
            userId: userMin,
            trainingProgramId: trainingMin
        };


        return res.status(200).json({
            msg: "Payment fetched successfully",
            success: true,
            data: responseData
        })
    }
    catch (error) {
        console.error("Get payment error:", error);
        return res.status(500).json({
            msg: "Failed to fetch payment",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

export const getUserPayments = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const payments = await prisma.payment.findMany({
            where: { userId: userId },
            include: {
                training: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // Map to match frontend expectations (trainingProgramId field was populated)
        const mappedPayments = payments.map(p => ({
            ...p,
            trainingProgramId: {
                title: p.training.title,
                week: p.training.week,
                description: "", // Schema check missing
            }
        }));

        return res.status(200).json({
            msg: "User payments fetched successfully",
            success: true,
            data: mappedPayments
        })
    } catch (error) {
        console.error("Get user payments error:", error);
        return res.status(500).json({
            msg: "Failed to fetch user payments",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                msg: "Session ID is required",
                success: false
            })
        }

        console.log('Verifying payment for session:', sessionId);

        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log('Stripe session status:', session.payment_status);

        if (!session) {
            return res.status(404).json({
                msg: "Payment session not found",
                success: false
            })
        }

        // Find the payment record
        const payment = await prisma.payment.findFirst({
            where: { paymentId: sessionId },
            include: { user: true, training: true }
        });

        if (!payment) {
            return res.status(404).json({
                msg: "Payment record not found",
                success: false
            })
        }

        // Check if user is authorized
        const userId = req.user.id || req.user._id;
        if (payment.userId !== userId) {
            return res.status(403).json({
                msg: "Unauthorized to verify this payment",
                success: false
            })
        }

        // If payment is successful in Stripe but still pending in our DB, update it
        if (session.payment_status === 'paid' && payment.status === 'pending') {
            console.log('Updating payment status from pending to completed');

            const updatedPayment = await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'completed',
                    paymentStatus: 'completed',
                    paymentMethod: session.payment_method_types?.[0] || 'card',
                    paymentOrderId: session.id, // Ensure this matches schema field
                    paymentCurrency: session.currency?.toUpperCase() || 'INR',
                    paymentDate: new Date()
                },
                include: { user: true, training: true }
            });

            // Send confirmation email
            try {
                await sendPaymentConfirmationEmail({
                    userEmail: updatedPayment.user.email,
                    userName: updatedPayment.user.name || updatedPayment.user.email.split('@')[0],
                    courseTitle: updatedPayment.training.title,
                    courseWeek: updatedPayment.training.week,
                    courseId: updatedPayment.training.id,
                    amount: updatedPayment.price,
                    paymentId: updatedPayment.id,
                    paymentDate: new Date()
                });
                console.log('Payment confirmation email sent to:', updatedPayment.user.email);
            } catch (emailError) {
                console.error('Failed to send confirmation email:', emailError);
                // Don't fail the verification if email fails
            }

            return res.status(200).json({
                msg: "Payment verified and updated successfully",
                success: true,
                data: {
                    payment: updatedPayment,
                    session: {
                        id: session.id,
                        status: session.payment_status,
                        amount_total: session.amount_total,
                        currency: session.currency
                    },
                    wasUpdated: true
                }
            });
        }

        return res.status(200).json({
            msg: "Payment verification successful",
            success: true,
            data: {
                payment,
                session: {
                    id: session.id,
                    status: session.payment_status,
                    amount_total: session.amount_total,
                    currency: session.currency
                },
                wasUpdated: false
            }
        })
    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({
            msg: "Failed to verify payment",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

export const testStripe = async (req, res) => {
    try {
        console.log('Testing Stripe connection...');

        // Test Stripe connection by creating a simple session
        const testSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Test Product',
                        description: 'Test payment session'
                    },
                    unit_amount: 100, // 1 rupee
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
        });

        console.log('Test session created:', testSession.id);

        return res.status(200).json({
            msg: "Stripe connection successful",
            success: true,
            data: {
                sessionId: testSession.id,
                url: testSession.url,
                stripeConfigured: true
            }
        })
    } catch (error) {
        console.error("Stripe test error:", error);
        return res.status(500).json({
            msg: "Stripe connection failed",
            success: false,
            error: error.message
        })
    }
}
