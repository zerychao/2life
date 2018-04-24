
var dairyList=[
  {
    title:"很开心efhjbfjhbjfhberjfhbejrbjherfbjherfbjehrfbjhebfjerhbfhberjhbfjrehf！",
    content:"吉萨本科插班生开场白酷暑的出口标识的客户保持可谁都不吃亏还是本地缓存白色的本场比赛计划的补偿金",
    id:1,
    emotion:1,
    data:"2018-04-11"
  },
  {
    title:"2",
    content:"kjsddnkjdbvkdf",
    id:2,
    emotion: 2,
    data: "2018-04-11"
  },
  {
    title: "3",
    content: "sjkffjdbjhf",
    id: 3,
    emotion: 3,
    data: "2018-04-09"
  },
  {
    title: "4",
    content: "kjsddnkjdbvkdf",
    id: 4,
    emotion: 4,
    data: "2018-04-06"
  },
  {
    title: "5",
    content: "kjsddnkjdbvkdf",
    id: 5,
    emotion: 5,
    data: "2018-04-06"
  },
  {
    title: "6",
    content: "kjsddnkjdbvkdf",
    id: 6,
    emotion: 6,
    data: "2018-04-03"
  },
  {
    title: "7",
    content: "kjsddnkjdbvkdf",
    id: 7,
    emotion: 6,
    data: "2018-04-03"
  },
  {
    title: "8",
    content: "kjsddnkjdbvkdf",
    id: 8,
    emotion: 6,
    data: "2018-04-03"
  },
    {
    title: "9",
    content: "kjsddnkjdbvkdf",
    id: 9,
    emotion: 6,
    data: "2018-04-01"
  },
    {
      title: "10",
      content: "kjsddnkjdbvkdf",
      id: 6,
      emotion: 6,
      data: "2018-04-01"
    },
    {
      title: "11",
      content: "kjsddnkjdbvkdf",
      id: 11,
      emotion: 6,
      data: "2018-04-01"
    }
]
var arr = new Array(6);   //表格有10行  
for (var i = 0; i < arr.length; i++) {
  arr[i] = new Array();    //每行有10列  
}
arr[0][0]=dairyList[0];
  var count=0;
  for(var i=1,j=1;i<dairyList.length;i++,j++){
    if(dairyList[j].data==dairyList[j-1].data){
      arr[count][j] = dairyList[i];
    }
    else{
      count++;
      j=0;
      arr[count][j]=dairyList[i];
    }
  }
module.exports={
  dairyList:dairyList,
  dairyPartList:arr
}