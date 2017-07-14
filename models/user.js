// Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
// sometimes causes errors on Windows machines
var bcrypt = require('bcrypt-nodejs')
// Creating our User model
module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define(
		'User',
		{
			// The email cannot be null, and must be a proper email before creation
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true
				}
			},
			// The password cannot be null
			password: {
				type: DataTypes.STRING,
				allowNull: false
			},
			verification: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			}
		},
		{
			// Hooks are automatic methods that run during various phases of the User Model lifecycle
			// In this case, before a User is created, we will automatically hash their password
			hooks: {
				beforeCreate: function(user, options, cb) {
					user.password = bcrypt.hashSync(
						user.password,
						bcrypt.genSaltSync(10),
						null
					)
				}
			}
		}
	)

	// Creating a custom method for our User model. This will check if an unhashed password entered by
	// The user can be compared to the hashed password stored in our database
	User.prototype.validPassword = function(password) {
		return bcrypt.compareSync(password, this.password)
	}
	return User
}
