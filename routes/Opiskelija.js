var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display Opiskelija page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM Opiskelija ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/Opiskelija/index.ejs
            res.render('Opiskelija',{data:''});   
        } else {
            // render to views/Opiskelija/index.ejs
            res.render('Opiskelija',{data:rows});
        }
    });
});

// display add Opiskelija page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('Opiskelija/add', {
        etunimi: '',
        sukunimi: '',
        luokkatunnus: ''                
    })
})

// add a new Opiskelija
router.post('/add', function(req, res, next) {    

    let etunimi = req.body.etunimi;
    let sukunimi = req.body.sukunimi;
    let luokkatunnus = req.body.luokkatunnus;
    let errors = false;

    if(etunimi.length === 0 || sukunimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter data");
        // render to add.ejs with flash message
        res.render('Opiskelija/add', {
            etunimi: etunimi,
            sukunimi: sukunimi,
            luokkatunnus: luokkatunnus
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            etunimi: etunimi,
            sukunimi: sukunimi,
            luokkatunnus: luokkatunnus
        }
        
        // insert query
        dbConn.query('INSERT INTO Opiskelija SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('Opiskelija/add', {
                    etunimi: form_data.etunimi,
                    sukunimi: form_data.sukunimi,
                    luokkatunnus: form_data.luokkatunnus                    
                })
            } else {                
                req.flash('success', 'Book successfully added');
                res.redirect('/Opiskelija');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM Opiskelija WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Student not found with id = ' + id)
            res.redirect('/Opiskelija')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('Opiskelija/edit', {
                title: 'Edit students', 
                id: rows[0].id,
                etunimi: rows[0].etunimi,
                sukunimi: rows[0].sukunimi,
                luokkatunnus: rows[0].luokkatunnus
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let etunimi = req.body.etunimi;
    let sukunimi = req.body.sukunimi;
    let luokkatunnus = req.body.luokkatunnus;
    let errors = false;

    if(etunimi.length === 0 || sukunimi.length === 0 || luokkatunnus.length == 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter etunimi and sukunimi");
        // render to add.ejs with flash message
        res.render('Opiskelija/edit', {
            id: req.params.id,
            etunimi: etunimi,
            sukunimi: sukunimi,
            luokkatunnus: luokkatunnus
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            etunimi: etunimi,
            sukunimi: sukunimi,
            luokkatunnus: luokkatunnus
        }
        // update query
        dbConn.query('UPDATE Opiskelija SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('Opiskelija/edit', {
                    id: req.params.id,
                    etunimi: form_data.etunimi,
                    sukunimi: form_data.sukunimi,
                    luokkatunnus: form_data.luokkatunnus
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/Opiskelija');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM Opiskelija WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to Opiskelija page
            res.redirect('/Opiskelija')
        } else {
            // set flash message
            req.flash('success', 'Student successfully deleted! id = ' + id)
            // redirect to Opiskelija page
            res.redirect('/Opiskelija')
        }
    })
})

module.exports = router;