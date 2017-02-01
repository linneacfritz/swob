require 'spreadsheet'
Spreadsheet.client_encoding = 'UTF-8'

book = Spreadsheet.open 'out.xlsx'

sheet1 = book.worksheet 'Worksheet1'
sheet2 = book.worksheet 'Worksheet2'

number_of_rows = sheet2.row_count

choose_row = rand (0..number_of_rows)

row_to_change = choose_row - choose_row % 5 + 2

node_to_change = sheet1[row_to_change, 0]

hw_to_change = sheet1[row_to_change-1, 1]

sw_to_change = sheet2[row_to_change-1, 1]

$i=0
while $i<10 do
  sheet2[5*$i+1, 1]='555555555555'
  $i+=1
end

$j=0
while $j<10 do
  puts sheet2[5*$j+1, 1]
  $j+=1
end


book.write 'out.xlsx'

















  
  

