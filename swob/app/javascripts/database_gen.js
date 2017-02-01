XLSX = require('/usr/lib/node_modules/truffle/node_modules/xlsx');
var ws1_name = "Sheet1";
var ws2_name = "Sheet2";
var wb = new Workbook(), ws1 = gen_table1(), ws2 = gen_table2();
/* add worksheet to workbook */
wb.SheetNames.push(ws1_name);
wb.SheetNames.push(ws2_name);
wb.Sheets[ws1_name] = ws1;
wb.Sheets[ws2_name] = ws2;

Workbook();
//waiting();
//insert_data();

var counter=0;


var timerId = setInterval(function() { insert_data() }, 1000);

function gen_table1() {
    var maximum = 1000000000;
    var minimum = 0;
    var ws = {};
    var range = {s: {c:0, r:0}, e: {c:3, r:1000 }};
    ws[XLSX.utils.encode_cell({c:0, r:0})] = {v: "Node id"};
    ws[XLSX.utils.encode_cell({c:1, r:0})] = {v: "Hardware"};
    ws[XLSX.utils.encode_cell({c:2, r:0})] = {v: "Variant"};
    for(var R = 1; R != range.e.r; ++R) {
		  for(var C = 0; C != range.e.c; ++C) {
        var node_data=(Math.random() * (maximum - minimum + 1) ) << 0;
        var cell = {v: node_data};
			  var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			  ws[cell_ref] = cell;
		  }
	 }

    var wscols = [{wch:20}, {wch:20}, {wch:20}, {wch:20}, {wch:20}];
    ws['!cols'] = wscols;
    ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
  }

  function gen_table2() {
    var maximum = 1000000000;
    var minimum = 0;
    var ws = {};
    var range = {s: {c:0, r:0}, e: {c:5, r:1000 }};
    ws[XLSX.utils.encode_cell({c:0, r:0})] = {v: "Hardware"};
    ws[XLSX.utils.encode_cell({c:1, r:0})] = {v: "Software1"};
    ws[XLSX.utils.encode_cell({c:2, r:0})] = {v: "Software2"};
    ws[XLSX.utils.encode_cell({c:3, r:0})] = {v: "Software3"};
    ws[XLSX.utils.encode_cell({c:4, r:0})] = {v: "Software4"};

  for(var C = 0; C != 1; C++) {
		  for(var R = 1; R != range.e.r; ++R) {
        var node_data=ws1['B'+(R+1)].v;
        var cell = {v: node_data};
        var cell_ref = XLSX.utils.encode_cell({c:0,r:R});
        ws[cell_ref] = cell;
		  }
}
    for(var C = 1; C != 2; C++) {
    for(var R = 1; R != range.e.r; ++R) {
      var node_data=(Math.random() * (maximum - minimum + 1) ) << 0;

      var cell = {v: node_data};
      var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
      ws[cell_ref] = cell;
    }
}
  for(var C = 2; C != 3; C++) {
    for(var R = 1; R != range.e.r; ++R) {
      var node_data=(Math.random() * (maximum - minimum + 1) ) << 0;
      var cell = {v: node_data};
      var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
      ws[cell_ref] = cell;
    }
	 }

  for(var C = 3; C != 4; C++) {
    for(var R = 1; R != range.e.r; ++R) {
      var node_data=(Math.random() * (maximum - minimum + 1) ) << 0;
      var cell = {v: node_data};
      var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
      ws[cell_ref] = cell;
    }
	 }

  for(var C = 4; C != 5; C++) {
    for(var R = 1; R != range.e.r; ++R) {
      var node_data=(Math.random() * (maximum - minimum + 1) ) << 0;
      var cell = {v: node_data};
      var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
      ws[cell_ref] = cell;
    }
	 }

    var wscols = [{wch:20}, {wch:20}, {wch:20}, {wch:20}, {wch:20}];
    ws['!cols'] = wscols;
    ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
  }


  function Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
  }



function insert_data(){
console.log(counter);
if (counter>7)
	{clearTimeout(timerId);}
  var range = ws2['!ref'];
  var end = 1000;
  var min=0;
//var row=data_to_insert[counter];
  var data = 5555555555;
  var random_row=(Math.random() * (end - min + 1) ) << 0;
  console.log(random_row);

ws2[XLSX.utils.encode_cell({c:1, r:(random_row-1)})] = {v: 5555555555};
counter++;
}


/* write file */
XLSX.writeFile(wb, 'out.xlsx');
