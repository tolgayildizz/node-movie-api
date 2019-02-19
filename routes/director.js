const express = require('express');
const mongoose = require('mongoose');
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

router.delete('/:director_id', (req,res)=> {
  const promise = Director.findByIdAndRemove(req.params.director_id);

	promise.then((director) => {
		if (!director)
			res.send({ message: 'The director was not found.', code: 2 });

		res.json({status:1});
	}).catch((err) => {
		res.json(err);
	});
});


router.put('/:director_id', (req,res)=> {
  const promise = Director.findByIdAndUpdate(
		req.params.director_id,
    req.body,
    {new:true}
	);

	promise.then((director) => {
		if (!director)
			res.send({ message: 'The director was not found.', code: 99 });

		res.json(director);
	}).catch((err) => {
		res.json(err);
	});
});


router.get('/:director_id', (req, res, next) => {

  const promise = Director.aggregate([
    {
      $match: {
        '_id':mongoose.Types.ObjectId(req.params.director_id), 
      }
    },
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

module.exports = router;
