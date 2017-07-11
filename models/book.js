module.exports = function(sequelize, DataTypes) {

  var Book = sequelize.define("Book", {
    // http://docs.sequelizejs.com/variable/index.html#static-variable-DataTypes
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    issue: { type: DataTypes.INTEGER },
    publish_date: { 
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        len:[4,4]
      }
     },
    publisher: { type: DataTypes.STRING },
    synopsis: { type: DataTypes.TEXT },
    img_url: { type: DataTypes.TEXT },
    characters: { type: DataTypes.TEXT},
    teams: { type: DataTypes.TEXT}
    }
  );

  // This is the updated version and replaces the use of classMethods
  // We're saying that we want our Book to have Artwork
  Book.associate = function (models) {
    
    Book.hasMany(models.Artwork, {
            onDelete: "cascade"
          });
  };

  return Book;
};