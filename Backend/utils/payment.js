import Stripe from "stripe"

console.log("Loading payment.js. Env Key:", process.env.STRIPE_SECRET_KEY);
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key_for_debug")
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined")
}