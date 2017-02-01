require 'spreadsheet'
NODE_ID = 10000000000
HARDWARE = 10000000000
SOFTWARE = 10000000000
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
#sheet1.column(3).width = 15

sheet2.column(0).width = 20
sheet2.column(1).width = 20
sheet2.column(2).width = 20
sheet2.column(3).width = 20
sheet2.column(4).width = 20


#write titles for each column
sheet1[0,0]= 'Node id'
sheet1[0,1]= 'Hardware'
sheet1[0,2]= 'Variant'

sheet2[0,0]= 'Hardware'
sheet2[0,1]= 'Software 1'
sheet2[0,2]= 'Software 2'
sheet2[0,3]= 'Software 3'
sheet2[0,4]= 'Software 4'


#create array with all node identifiers 

100.times do
  node = rand(1...NODE_ID)
  all_nodes.push(node)
end


#for each node, create 5 entries in spreadsheet 1 of hardware and variant
#for each new hardware item in spreadsheet 1, make an entry with 4 software matches in spreadsheet 2

for i in 1..all_nodes.length

  id = all_nodes.pop
  for j in 1..5 do
    sheet1[sheet1.count, 0] = id

    #sheet1[sheet1.count-1, 1] = rand (1...HARDWARE)
    hw = rand (1...HARDWARE)
    
    sheet1[sheet1.count-1, 1] = hw

    sheet1[sheet1.count-1, 2] = rand (1...VARIANT)

    sheet2[sheet2.count, 0] = hw

    sheet2[sheet2.count-1, 1] = rand (1...SOFTWARE)

    sheet2[sheet2.count-1, 2] = rand (1...SOFTWARE)

    sheet2[sheet2.count-1, 3] = rand (1...SOFTWARE)

    sheet2[sheet2.count-1, 4] = rand (1...SOFTWARE)
  end 
end



book.write 'out.xlsx'

