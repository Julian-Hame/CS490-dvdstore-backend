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
        const query = 'SELECT customer.customer_id, first_name, last_name, count(rental.customer_id) AS count FROM customer LEFT OUTER JOIN rental ON rental.customer_id=customer.customer_id GROUP BY customer.customer_id ORDER BY customer.customer_id'
    
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

    app.get('/api/film-genre/:id', (req, res) => {
        let id = req.params.id;
        const query = "SELECT film.film_id, category.category_id, name FROM film INNER JOIN film_category ON film_category.film_id=film.film_id INNER JOIN category ON category.category_id=film_category.category_id WHERE film.film_id = '" + id + "'"
    
        connection.query(query, (err, results) => {
            if(err) {
                console.error('Error executing query:', err);
                res.status(500).json({error: 'Error retrieving films from the database.'});
                return;
            }
            res.json(results);
        })
    })

    app.get('/api/film-actors', (req, res) => {
        let id = req.params.id;
        const query = "SELECT actor.first_name, actor.last_name, film.title FROM actor INNER JOIN film_actor ON actor.actor_id=film_actor.actor_id INNER JOIN film ON film_actor.film_id=film.film_id"
    
        connection.query(query, (err, results) => {
            if(err) {
                console.error('Error executing query:', err);
                res.status(500).json({error: 'Error retrieving film actors from the database.'});
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

    app.get('/api/customer/:id', (req, res) => {
        let id = req.params.id;
        const query = "SELECT * FROM customer WHERE customer_id='" + id + "'"
    
        connection.query(query, (err, results) => {
            if(err) {
                console.error('Error executing query:', err);
                res.status(500).json({error: 'Error retrieving customers from the database.'});
                return;
            }
            res.json(results);
        })
    })

    app.get('/api/customer-rented/:id', (req, res) => {
        let id = req.params.id;
        const query = "SELECT film.title, rental.return_date FROM film INNER JOIN inventory ON film.film_id = inventory.film_id INNER JOIN rental ON rental.inventory_id = inventory.inventory_id INNER JOIN customer ON rental.customer_id = customer.customer_id WHERE customer.customer_id = '" + id + "'"
    
        connection.query(query, (err, results) => {
            if(err) {
                console.error('Error executing query:', err);
                res.status(500).json({error: 'Error retrieving customers from the database.'});
                return;
            }
            res.json(results);
        })
    })

    app.put('/api/customer/:id/update', (req, res) => {
        let id = req.params.id
        const updatedCustomer = req.body
      
        const query = `UPDATE customer SET ? WHERE customer.customer_id = ?`
        const params = [updatedCustomer, id]
      
        connection.query(query, params, (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Error updating customer in database' })
          }
      
          res.json({ message: 'Customer updated successfully' })
        })
    })

    app.post('/api/customer-new', (req, res) => {
        const customerData = req.body;
        const query = `INSERT INTO customer SET ?`;
        const values = {
            store_id: customerData.storeId,
            first_name: customerData.firstName.toUpperCase(),
            last_name: customerData.lastName.toUpperCase(),
            email: customerData.email.toUpperCase(),
            address_id: customerData.addressId,
            active: customerData.active
        };

        console.log(values)

        connection.query(query, values, (err, results) => {
            if (err) {
            console.error('Error inserting customer:', err);
            return res.status(500).json({ message: 'Error inserting customer' });
            }

            console.log(`Customer inserted successfully: ${results.insertId}`);
            res.json({ message: 'Customer inserted successfully' });
        });
    });

    app.delete('/api/customer-delete/:id', (req, res) => {
        const id = req.params.id;
        const query = `DELETE FROM customer WHERE customer.customer_id = ${id}`;
        connection.query(query, (err, results) => {
          if (err) {
            console.error('Error deleting customer:', err);
            return res.status(500).json({ message: 'Error deleting customer from database.' });
          }
          console.log(`Customer deleted successfully: ${id}`);
          res.json({ message: 'Customer deleted successfully' });
        });
    });

    app.post('/api/rental', (req, res) => {
        const rentalData = req.body;
        const query = `INSERT INTO rental SET ?`;
        const values = {
            inventory_id: rentalData.inventoryId,
            customer_id: rentalData.renterId,
            staff_id: rentalData.staffId
        };

        console.log(values)

        connection.query(query, values, (err, results) => {
            if (err) {
            console.error('Error inserting rental:', err);
            return res.status(500).json({ message: 'Error inserting rental into database. Make sure the values you entered are correct.' });
            }

            console.log(`Rental inserted successfully: ${results.insertId}`);
            res.json({ message: 'Rental inserted successfully' });
        });
    });
}
