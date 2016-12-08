//mongo fgc-dev series.js

//csv to js object function
var lastHeader;

function csvTojs(csv) {
  var lines = csv.split('\n');
  var result = [];
  var headers = lines[0].split(',');

  //assign lastHeader
  lastHeader = headers[headers.length - 1];
  for(var i = 1; i < lines.length; i++) {
    var obj = {};

    var row = lines[i];
    var queryIdx = 0;
    var startValueIdx = 0;
    var idx = 0;

    if(row.trim() === '') {
      continue;
    }

    while(idx < row.length) {
      /* if we meet a double quote we skip until the next one */
      var c = row[idx];

      if(c === '"') {
        do {
          c = row[++idx];
        } while(c !== '"' && idx < row.length - 1);
      }

      if(c === ',' || /* handle end of line with no comma */ idx === row.length - 1) {
        /* we've got a value */
        var value = row.substr(startValueIdx, idx - startValueIdx).trim();

        /* skip first double quote */
        if(value[0] === '"') {
          value = value.substr(1);
        }
        /* skip last comma */
        if(value[value.length - 1] === ',') {
          value = value.substr(0, value.length - 1);
        }
        /* skip last double quote */
        if(value[value.length - 1] === '"') {
          value = value.substr(0, value.length - 1);
        }

        var key = headers[queryIdx++];
        obj[key] = value;
        startValueIdx = idx + 1;
      }

      ++idx;
    }

    result.push(obj);
  }
  return result;
}

var seriesData = csvTojs(cat('./csv/series.csv'));

for(var i = 0; i < seriesData.length; i++) {
  print(JSON.stringify(seriesData[i]));
  var _id = seriesData[i]._id;
  var query = {};
  if(_id) {
    query._id = ObjectId(_id);
  } else {
    query.name = seriesData[i].name;
  }
  db.series.update(query, {
    '$set': {
      '_id': _id ? ObjectId(_id) : new ObjectId(),
      'name': seriesData[i].name,
      'game': ObjectId(seriesData[i].game)
    }
  }, {'upsert': true});
}
