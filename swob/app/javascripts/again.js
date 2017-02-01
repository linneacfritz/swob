XLSX = require('/usr/lib/node_modules/truffle/node_modules/xlsx');
var ws_name = "Sheet1";



var wb = new Workbook();
var ws;

/* add worksheet to workbook */
wb.SheetNames.push(ws_name);


Workbook();
ws = generateCellData();
wb.Sheets[ws_name] = ws;
console.log(wb.Sheets[ws_name]);
console.log(ws);
XLSX.writeFile(wb, 'hoohoo.xlsx');
/*
function sheet_from_array_of_arrays() {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != myData.length; ++R) {
		for(var C = 0; C != myData[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: myData[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
      console.log(cell_ref);
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';

			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}*/

  function generateCellData(){
    var ws = {};
    var cell;
    for (R=0;R<10;R++){
      for(C=0;C<2;C++){
        var cell={v: 7777777};
        cell.t ='n';
        var cell_reference = XLSX.utils.encode_cell({c:C,r:R});
        ws[cell_reference]=cell;

      }

    }
//console.log("data: " + ws22[cell_reference].v);
  return ws;
  }

/* original data */


function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}



/* write file */
