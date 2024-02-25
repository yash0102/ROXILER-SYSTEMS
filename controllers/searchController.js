import App from "../model/AppModel.js";

export const getAllData = async (req, res) => {
  try {
    const selectedMonth = parseInt(req.params.month);

    let query = {};

    if (req.query.search) {
      query = {
        $and: [
          { month: selectedMonth },
          {
            $or: [
              { title: { $regex: req.query.search, $options: "i" } },
              { description: { $regex: req.query.search, $options: "i" } },
              { price: parseFloat(req.query.search) || 0 },
            ],
          },
        ],
      };
    } else {
      query = { month: selectedMonth };
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const transactions = await App.find(query).skip(skip).limit(limit);
    const total = await App.countDocuments(query);
    const numOfPages = Math.ceil(total / limit);

    res.status(200).json({
      selectedMonth,
      total,
      numOfPages,
      currentPage: page,
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

