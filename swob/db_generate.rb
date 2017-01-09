require 'spreadsheet'
NODE_ID = 1000000000
HARDWARE = 1000
SOFTWARE_OLD =1000000000
SOFTWARE_NEW =1000000000
VARIANT = 50

Spreadsheet.client_encoding = 'UTF-8'

book = Spreadsheet::Workbook.new

all_nodes = Array.new()

#create two worksheets, one for each table
sheet1 = book.create_worksheet
sheet2 = book.create_worksheet

#set width of columns in both worksheets
sheet1.column(0).width = 15
sheet1.column(1).width = 15
sheet1.column(2).width = 15
sheet1.column(3).width = 15

sheet2.column(0).width = 15
sheet2.column(1).width = 15


#write titles for each column

sheet1[0,0]= 'Node id'
sheet1[0,1]= 'Software NEW'
sheet1[0,2]= 'Software OLD'
sheet1[0,3]= 'Variant'

sheet2[0,0]= 'Software'
sheet2[0,1]= 'Hardware 1'
sheet2[0,2]= 'Hardware 2'
sheet2[0,3]= 'Hardware 3'
sheet2[0,4]= 'Hardware 4'

#create array with all node identifiers 

100.times do
  node = rand(1...NODE_ID)
  all_nodes.push(node)
end

#puts "#{all_nodes}"

#for each node, create between 1 and 8 entries in spreadsheet 1 of new/old software and variant
#for each new software item in spreadsheet 1, make an entry with 4 hardware matches in spreadsheet 2

for i in 1..all_nodes.length
  n = rand(1...8)

  id = all_nodes.pop
  for j in 1..n do
    sheet1[sheet1.count, 0] = id

    sheet1[sheet1.count-1, 1] = rand (1...SOFTWARE_OLD)
  
    sof_new = rand (1...SOFTWARE_NEW)
    
    sheet1[sheet1.count-1, 2] = sof_new

    sheet1[sheet1.count-1, 3] = rand (1...VARIANT)

    sheet2[sheet2.count, 0] = sof_new

    sheet2[sheet2.count-1, 1] = rand (1...HARDWARE)

    sheet2[sheet2.count-1, 2] = rand (1...HARDWARE)

    sheet2[sheet2.count-1, 3] = rand (1...HARDWARE)

    sheet2[sheet2.count-1, 4] = rand (1...HARDWARE)
  end 
end



book.write 'out.xlsx'

