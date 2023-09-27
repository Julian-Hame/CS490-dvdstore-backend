const connection = require('./config/database')

module.exports = (app) => {
    app.get('/status', (req, res) => {
        res.send({
            message: 'hello world!'
        })
    })
    
    app.post('/register', (req, res) => {
        res.send({
            message: `Hello, ${req.body.email}! You are registered!`
        })
    })

    app.get('/api/top-actors', (req, res) => {
        const query = 'SELECT actor.actor_id, first_name, last_name, count(film_actor.actor_id) AS movies FROM actor INNER JOIN film_actor ON actor.actor_id=film_actor.actor_id GROUP BY actor.actor_id ORDER BY movies DESC LIMIT 5'
    
        connection.query(query, (err, results) => {
            if(err) {
                console.error('Error executing query:', err);
                res.status(500).json({error: 'Error retrieving actors from the database.'});
                return;
            }
            res.json(results);
        })
    })

    app.get('/api/top-picks', (req, res) => {
        const query = 'SELECT title, film.film_id, COUNT(rental.inventory_id) AS rented FROM film INNER JOIN inventory ON inventory.film_id = film.film_id INNER JOIN rental ON rental.inventory_id = inventory.inventory_id GROUP BY title, film.film_id ORDER BY rented DESC LIMIT 5'
    
        connection.query(query, (err, results) => {
            if(err) {
                console.error('Error executing query:', err);
                res.status(500).json({error: 'Error retrieving top picks from the database.'});
                return;
            }
            res.json(results);
        })
    })

    app.get('/api/customers', (req, res) => {
        const query = 'SELECT customer.customer_id, first_name, last_name, count(rental.customer_id) AS count FROM customer INNER JOIN rental ON rental.customer_id=customer.customer_id GROUP BY customer.customer_id ORDER BY customer.customer_id'
    
        connection.query(query, (err, results) => {
            if(err) {
                console.error('Error executing query:', err);
                res.status(500).json({error: 'Error retrieving customers from the database.'});
                return;
            }
            res.json(results);
        })
    })

    app.get('/api/films', (req, res) => {
        const query = 'SELECT film.film_id, title, category.category_id, name FROM film INNER JOIN film_category ON film_category.film_id=film.film_id INNER JOIN category ON category.category_id=film_category.category_id'
    
        connection.query(query, (err, results) => {
            if(err) {
                console.error('Error executing query:', err);
                res.status(500).json({error: 'Error retrieving films from the database.'});
                return;
            }
            res.json(results);
        })
    })
    
    app.get('/api/film/:id', (req, res) => {
        let id = req.params.id;
        const query = "SELECT * FROM film WHERE film_id='" + id + "'"
    
        connection.query(query, (err, results) => {
            if(err) {
                console.error('Error executing query:', err);
                res.status(500).json({error: 'Error retrieving films from the database.'});
                return;
            }
            res.json(results);
        })
    })

    app.get('/api/actor/:id', (req, res) => {
        let id = req.params.id;
        const query = "SELECT * FROM actor WHERE actor_id='" + id + "'"
    
        connection.query(query, (err, results) => {
            if(err) {
                console.error('Error executing query:', err);
                res.status(500).json({error: 'Error retrieving films from the database.'});
                return;
            }
            res.json(results);
        })
    })

    app.get('/api/actor-top-films/:id', (req, res) => {
        let id = req.params.id;
        const query = "SELECT title, COUNT(rental.inventory_id) as rented FROM film INNER JOIN inventory ON inventory.film_id = film.film_id INNER JOIN rental ON rental.inventory_id = inventory.inventory_id JOIN film_actor ON film_actor.film_id = film.film_id JOIN actor ON actor.actor_id = film_actor.actor_id WHERE actor.actor_id = '" + id + "' GROUP BY title ORDER BY rented DESC LIMIT 5"
    
        connection.query(query, (err, results) => {
            if(err) {
                console.error('Error executing query:', err);
                res.status(500).json({error: 'Error retrieving films from the database.'});
                return;
            }
            res.json(results);
        })
    })
}
