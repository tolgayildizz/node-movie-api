const express = require('express');
const router = express.Router();

//Models 

const Director = require('../models/Director');

/* GET home page. */
router.get('/', (req, res, next) => {

  const promise = Director.aggregate([
    {
			$lookup: {
				from: 'moviews',
				localField: '_id',
				foreignField: 'director_id',
				as: 'moviews'
			}
    },
    {
      $unwind: { //Değişken içine atma işlemi
        path:'$moviews',
        preserveNullAndEmptyArrays: true //Boş Alanalarıda getirir. Filmi olmayan yönetmen
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        moviews: {
          $push:'$moviews'
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        moviews: '$moviews'
      }
    }

  ]);



  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  })

});

router.post('/', (req, res, next) => {
  const director = new Director(req.body);
  const promise = director.save();
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

module.exports = router;
