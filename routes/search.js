var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({
    results :
      [{
        professor_name:"Hongfei Li",
        department: "Info Science",
        average_review: 1.0,
        number_of_reviews: 2,
        courses: [
          {
            course_id: "INFO 3333",
            course_name: "Introduction to three thousand three hundred and thirty three"
          },
          {
            course_id: "INFO 222",
            course_name: "Introduction to a course with looooooooooooooooooooooooooooonnnnnnngggg name"
          }
        ]},
        {
          professor_name:"Gilly Leshed",
          department: "Info Science",
          average_review: 4.9,
          number_of_reviews: 222,
          courses: [
            {
              course_id: "INFO 4999",
              course_name: "Introduction to a course with a short name"
            }
          ]
    }]
  })
});
module.exports = router;
