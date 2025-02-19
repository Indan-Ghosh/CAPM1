const cds = require("@sap/cds");

module.exports = function () {
  this.after('CREATE', 'db.booknm.Reviews', async (req) => {
    //const { subject } = req.data;
    
    console.log(req); // Check if req.data exists
    if (!req.data) throw new Error("Missing data in request");
    const { subject } = req.data?.subject;
    console.log(subject); // Undefined if req.data is missing

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
