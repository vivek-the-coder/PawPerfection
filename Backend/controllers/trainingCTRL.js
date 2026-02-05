import prisma from '../db/prisma.js';

export const createTrainingProgram = async (req, res) => {
  try {
    const { week, title, task, resources, price } = req.body;
    console.log(req.body);
    if (!week || !title || !task || !resources || (price === undefined))
      return res
        .status(400)
        .json({ msg: "Cant create Task", success: false });

    //normalize Title
    const normalizeTitle = title;

    if (price < 0)
      return res
        .status(400)
        .json({ msg: "Price can't be negative", success: false });

    // Check if training already exists
    const existingTraining = await prisma.training.findFirst({
      where: {
        week: Number(week),
        title: normalizeTitle,
        price: Number(price)
        // Note: Prisma array comparison is strict, so we might skip exact array matching for existence check simplicity
        // or we rely on week+title uniqueness if that's the business rule.
        // Using week+title for now.
      }
    });

    if (existingTraining)
      return res.status(409).json({ msg: "Already Exist", success: false });

    const trainingModel = await prisma.training.create({
      data: {
        week: Number(week),
        title: normalizeTitle,
        task: task, // Assumed to be string[]
        resources: resources, // Assumed to be string[]
        price: Number(price),
      }
    });

    return res.status(201).json({
      msg: "Program created Successfully",
      success: true,
      trainingModel: {
        ...trainingModel,
        _id: trainingModel.id // Map id back to _id
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Can't create Program", success: false });
  }
}

export const updateTrainingProgram = async (req, res) => {
  try {
    const { trainingId } = req.params;
    const { task, title, week, resources, price } = req.body;

    //  Ensure the task is a non-empty array
    if (!task || !Array.isArray(task) || task.length === 0) {
      return res.status(400).json({
        msg: "Invalid inputs. Tasks can't be empty.",
        success: false,
      });
    }

    // Update the training program with the provided fields
    try {
      const updatedTrainingModel = await prisma.training.update({
        where: { id: trainingId },
        data: { task, title, week, resources, price }
      });

      return res.status(200).json({
        msg: "Training program updated successfully.",
        success: true,
        updatedTrainingModel: {
          ...updatedTrainingModel,
          _id: updatedTrainingModel.id
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        return res
          .status(404)
          .json({ msg: "Training program not found.", success: false });
      }
      throw err;
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Can't edit and update the training program.",
      success: false,
    });
  }
}

export const deleteTrainingProgram = async (req, res) => {
  try {
    const { trainingId } = req.params;

    try {
      await prisma.training.delete({
        where: { id: trainingId },
      });
      return res.status(200).json({ msg: "Model deleted", success: true });
    } catch (err) {
      if (err.code === 'P2025') {
        return res
          .status(400) // Original code returned 400 for not found on delete
          .json({ msg: "no training model Exist", success: false });
      }
      throw err;
    }

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "can't delete the model", success: false });
  }
}

export const getTrainingPrograms = async (req, res) => {
  try {
    const trainingPrograms = await prisma.training.findMany();
    if (trainingPrograms.length === 0) {
      return res
        .status(200)
        .json({ msg: "No training programs found.", success: true, trainingPrograms: [] });
    }

    return res.status(200).json({
      msg: "Training programs fetched successfully.",
      success: true,
      trainingPrograms: trainingPrograms.map(t => ({ ...t, _id: t.id })),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error fetching training programs.",
      success: false,
    });
  }
}

export const getTrainingProgramBtID = async (req, res) => {
  try {
    const { id } = req.params;
    const trainingModel = await prisma.training.findUnique({ where: { id } });

    if (!trainingModel)
      return res
        .status(404)
        .json({ msg: "Can't find the model", success: false });

    return res.status(200).json({
      msg: "Training program fetched successfully.",
      success: true,
      trainingProgram: { ...trainingModel, _id: trainingModel.id },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Can't find the Model" });
  }
}
