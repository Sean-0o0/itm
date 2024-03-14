
A.页面说明
外包人员（新版）
一共四个页签
外包人员页面————日期区间筛选因为没有数据，所以才没测试
其他三个页签正常

B.文件说明
pmsPage.less
有很多改动，
因为原本和外包人员代码less代码和另一个页面的耦合了，没法修改
所以CV出来单独给了个样式（好像CV了几百行）
剩下的就是 @Import 没有影响

C.结论 ：1.只需要替换 pmsPage.less 内 除了 @import以外的代码
         2.MemberInfo_New  要改成 MemberInfo

AUTHOR:XUE JIN QI 
TIME: 20240314



