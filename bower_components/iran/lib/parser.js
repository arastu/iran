var striptags = require('striptags');
var crypto = require('crypto');
var persian = require('persianjs');
var jalaali = require('jalaali-js');

var schema = [
  'id',
  'city_name',
  'city_creation_date_raw',
  'city_division_code',
  'district_name',
  'county_name',
  'province_name'
];

module.exports = {
  parse: function (data) {
    //convert html string to array
    var tables = data
      //remove "<tbody>" html tag and new lines
      .replace(/(<tbody>|<\/tbody>|\r\n|\n|\r|\t|)/gm,'')
      //trim white spaces
      .trim()
      //create array of each table
      .split('</table>');

    var cities = [];

    tables.forEach(function (table, index, array) {
      if (table) {
        table.split('</tr>').forEach(function (tableRow, index, array) {
          //city info object
          var city = {};

          //skip first table row contain header data and empty table row
          if(tableRow && index > 0) {
            tableRow.split('</td>').forEach(function (tableRowData, index, array) {
              if(tableRowData && index < 7) {
                //remove html tag and trim
                var item = striptags(tableRowData).trim();
                //convert arabic character to persian number

                if(item) {
                  item = persian(item)
                  .arabicChar()
                  .toString();
                }

                //format and convert city creation date to iso format
                if (index === 2) {
                  var cityCreationDate = item.split('/');
                  if(cityCreationDate.length > 1) {
                    var cityCreationDateGregorian = jalaali.toGregorian(parseInt(cityCreationDate[0]), parseInt(cityCreationDate[1]), parseInt(cityCreationDate[2]));
                    cityCreationDateGregorian = new Date(cityCreationDateGregorian.gy, cityCreationDateGregorian.gm, cityCreationDateGregorian.gd);
                    city['city_creation_date_iso'] = cityCreationDateGregorian.toISOString();
                  } else {
                    var cityCreationDateGregorian = jalaali.toGregorian(parseInt(cityCreationDate[0]), 1, 1);
                    cityCreationDateGregorian = new Date(cityCreationDateGregorian.gy, cityCreationDateGregorian.gm, cityCreationDateGregorian.gd);
                    city['city_creation_date_iso'] = cityCreationDateGregorian.toISOString();
                  }
                }

                //create city object based on schema
                city[schema[index]] = item;
              }
            });

            city.id = 'city_'
              + crypto
              .createHash('sha1')
              .update(tableRow)
              .digest('hex');

            //add to cities array
            cities.push(city);
          }
        });
      }
    });

    return cities;
  }
};
