const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./dbConfig');

function initialize(passport) {
	const authenticateUser = (email, password, done) => {
		pool.query(
			`select * from players where email = $1`, [email], (err, results) => {
				if (err) {
					throw err;
				}
				console.log(results.rows);
				if (results.rows.length > 0) {
					const user = results.rows[0];
					if (user.password === password) {
						return done(null, user);
					} else {
						return done(null, false);
					}
				} else {
					return done(null, false);
				}
			}
		);
	}
	passport.use(
		new LocalStrategy({
			usernameField: "email",
			passwordField: "password"
		}, authenticateUser)
	);
	
	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser((id, done)=>{
		pool.query(
			`select * from players where id = $1`, [id], (err, results)=> {
				if (err) {
					throw err;
				}
				return done(null, results.rows[0])
			}
		);
	});

}

module.exports = initialize;