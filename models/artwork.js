module.exports = function(sequelize, DataTypes) {
  var Artwork = sequelize.define("Artwork", {
    books_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    page_num: { type: DataTypes.STRING },
    format: { type: DataTypes.STRING },
    img_url: { type: DataTypes.TEXT },
    description: { type: DataTypes.TEXT },
    feature: { type: DataTypes.TEXT }
  }
);

  // This is the updated version
  // http://docs.sequelizejs.com/manual/tutorial/upgrade-to-v4.html#breaking-changes
  // A books_id (foreignKey) is required or an Artwork can't be made
  Artwork.associate = function (models) {
     Artwork.belongsTo(models.Book, {
      foreignKey: {
      allowNull: false
      }
    });
  };
  return Artwork;
};