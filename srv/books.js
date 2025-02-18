const cds = require("@sap/cds");

module.exports = function () {
  this.on("CREATE", "Reviews", async (req) => {
    const { subject } = req.data;
    const tx = cds.transaction(req);

    // Calculate the average rating from the Reviews entity
    const result = await tx.run(
      SELECT.from("db.booknm.Reviews")
        .columns("round(avg(rating),1) as rating")  // Calculate the average and round it to 1 decimal place
        .where({ subject })  // Filter by the subject (which corresponds to the book ID)
    );

    // Check if a result was returned
    if (result && result.length > 0) {
      const averageRating = result[0].rating;

      // Update the Books entity with the new average rating
      await tx.run(
        UPDATE("db.booknm.Books")
          .set({ rating: averageRating })  // Set the rating field of the book to the average
          .where({ ID: subject })  // Find the book by its ID (subject)
      );
    }
  });
};
