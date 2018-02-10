/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : bishe

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-12-10 12:26:26
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `choice_error`
-- ----------------------------
DROP TABLE IF EXISTS `choice_error`;
CREATE TABLE `choice_error` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_name` varchar(100) DEFAULT NULL COMMENT '题目名称',
  `question_type` int(4) DEFAULT NULL COMMENT '题目类型：0.单选 1多选',
  `question_state` int(4) DEFAULT NULL COMMENT '无用',
  `question_option_a` varchar(100) DEFAULT NULL COMMENT '选项A',
  `question_option_b` varchar(100) DEFAULT NULL COMMENT '选项B',
  `question_option_c` varchar(100) DEFAULT NULL COMMENT '选项C',
  `question_option_d` varchar(100) DEFAULT NULL COMMENT '选项D',
  `correct_option` varchar(10) DEFAULT NULL COMMENT '正确答案',
  `point_id` int(11) DEFAULT NULL COMMENT '所用的知识点id',
  `point_name` varchar(20) DEFAULT NULL,
  `subject_id` int(11) DEFAULT NULL COMMENT '科目id',
  `subject_name` varchar(20) DEFAULT NULL COMMENT '科目名称',
  `student_id` int(11) DEFAULT NULL COMMENT '学生id',
  `student_name` varchar(20) DEFAULT NULL COMMENT '学生姓名',
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of choice_error
-- ----------------------------
INSERT INTO `choice_error` VALUES ('1', '一个C语言程序是由（）', '0', null, '一个主程序和若干子程序组成', '函数组成', '若干过程组成', '若干子程序组成', 'A', '15', '循环的嵌套', '1', 'C语言程序设计', '1', '宋小明');
INSERT INTO `choice_error` VALUES ('2', '一个C程序的执行是从（）', '0', null, '本程序的main函数开始,到main函数结束', '本程序文件的第一个函数开始,到本程序文件的最后一个函数结束', '本程序的main函数开始,到本程序文件的最后一个函数结束', '本程序文件的第一个函数开始,到本程序main函数结束', 'A', '8', '算术运算', '1', 'C语言程序设计', '1', '宋小明');
INSERT INTO `choice_error` VALUES ('3', 'C语言规定:在一个源程序中,main函数的位置（）', '0', null, '必须在最开始', '必须在系统调用的库函数的后面', '可以任意', '必须在最后', 'A', '13', '三种循环结构', '1', 'C语言程序设计', '1', '宋小明');
INSERT INTO `choice_error` VALUES ('4', '以下符合C语言语法的赋值表达式是（）', '0', null, 'd=9+e+f=d+9', 'd=9+e,f=d+9', 'd=9+e,e++,d+9', 'd=9+e++=d+7', 'A', '17', 'putchar与getchar函数', '1', 'C语言程序设计', '1', '宋小明');
INSERT INTO `choice_error` VALUES ('5', '以下叙述正确的是（）', '0', null, '在C程序中,main函数必须位于程序的最前面', 'C程序的每行中只能写一条语句', 'C语言本身没有输入输出语句', '在对一个C程序进行编译的过程中,可发现注释中的拼写错误', 'A', '14', 'break与continue', '1', 'C语言程序设计', '1', '宋小明');
INSERT INTO `choice_error` VALUES ('6', '在定义int a[2][3];之后,对a的引用正确的有()', '1', null, 'a[0][2]', 'a[1,3]', 'a[1>2][!1]', 'a[2][0]', 'A,C', '23', '字符串赋值', '1', 'C语言程序设计', '1', '宋小明');
INSERT INTO `choice_error` VALUES ('7', '以下可以定义为用户标识符的有（）', '1', null, 'scanf', 'short', '_3com_', 'int', 'A,C', '17', 'putchar与getchar函数', '1', 'C语言程序设计', '1', '宋小明');
INSERT INTO `choice_error` VALUES ('8', '以下选项中不是C语言合法整数的是（）', '1', null, '10110', '0386', '0Xffa', 'x2a2', 'B,D', '18', '函数的声明', '1', 'C语言程序设计', '1', '宋小明');
INSERT INTO `choice_error` VALUES ('9', '以下关于数组描述错误的是()', '1', null, '数组的大小是固定的,但可以有不同的类型的数组元素', '数组的大小是可变的,但所有数组元素的类型必须相同', '数组的大小是固定的,所有数组元素的类型必须相同', '数组的大小是可变的,可以有不同的类型的数组元素', 'A,B,D', '2', 'main函数', '1', 'C语言程序设计', '1', '宋小明');
INSERT INTO `choice_error` VALUES ('10', '以下叙述中正确的是()', '1', null, '一个C源程序可由一个或多个函数组成', '一个C源程序必须包含一个main()函数', 'C源程序的基本组成单位是函数', '在C源程序中,注释说明只能位于一条语句的最后', 'A,B,C', '6', '常量与变量', '1', 'C语言程序设计', '1', '宋小明');
INSERT INTO `choice_error` VALUES ('11', 'C语言规定:在一个源程序中,main函数的位置（）', '0', null, '必须在最开始', '必须在系统调用的库函数的后面', '可以任意', '必须在最后', 'A', '13', '三种循环结构', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('12', '在C语言中,要求运算数必须是整型的运算符是（）', '0', null, '/', '++', '!=', '%', 'A', '10', '自加自减运算', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('13', '若以下变量均是整型,且num=sum=7;则执行表达式sUM=num++,sUM++,++num后sum的值为（）', '0', null, '7', '8', '9', '10', 'A', '22', '字符数组', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('14', '已知字母A的ASCII码为十进制数65,且c2为字符型,则执行语句c2=\'A\'+\'6\'-\'3\';后,c2中的值为（）', '0', null, 'D', '68', '不确定的值', 'C', 'A', '4', '书写格式', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('15', '下面不正确的字符串常量是（）', '0', null, '\'abc\'', '\"12\'12\"', '\"0\"', '\"\"', 'A', '6', '常量与变量', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('16', '以下叙述中正确的是()', '1', null, '一个C源程序可由一个或多个函数组成', '一个C源程序必须包含一个main()函数', 'C源程序的基本组成单位是函数', '在C源程序中,注释说明只能位于一条语句的最后', 'A,B,C', '6', '常量与变量', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('17', '以下4个选项中,可以看作是一条语句的有()', '1', null, '{;}', 'a=0,b=0,c=0;', 'if(a>0);', 'if(b==0) m=1;n=2;', 'A,B,C', '13', '三种循环结构', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('18', '若a,b,c,d都是int型变量且初值为0,以下选项中正确的赋值语句是()', '1', null, 'a=b=c=d=100', 'd++', 'c+b', 'd=(c=22)-(b++)', 'A,B,D', '18', '函数的声明', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('19', '以下合法的十六进制数是()', '1', null, 'oxff', '0Xabc', '0x01', '0X9X', 'B,C', '16', '位运算符', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('20', '以下选项中不是C语言合法整数的是（）', '1', null, '10110', '0386', '0Xffa', 'x2a2', 'B,D', '18', '函数的声明', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('21', '下面不正确的字符串常量是（）', '0', null, '\'abc\'', '\"12\'12\"', '\"0\"', '\"\"', 'A', '6', '常量与变量', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('22', '以下叙述正确的是（）', '0', null, '在C程序中,main函数必须位于程序的最前面', 'C程序的每行中只能写一条语句', 'C语言本身没有输入输出语句', '在对一个C程序进行编译的过程中,可发现注释中的拼写错误', 'A', '14', 'break与continue', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('23', '以下叙述不正确的是（）', '0', null, '一个C源程序可由一个或多个函数组成', '一个C源程序必须包含一个main函数', 'C程序的基本组成单位是函数', '在C程序中,注释说明只能位于一条语句的后面', 'A', '15', '循环的嵌套', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('24', '一个C程序的执行是从（）', '0', null, '本程序的main函数开始,到main函数结束', '本程序文件的第一个函数开始,到本程序文件的最后一个函数结束', '本程序的main函数开始,到本程序文件的最后一个函数结束', '本程序文件的第一个函数开始,到本程序main函数结束', 'A', '8', '算术运算', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('25', '下列四组选项中,均不是C语言关键字的选项是（）', '0', null, 'define if type', 'getc char printf', 'include scanf case', 'while go pow', 'A', '12', 'scanf函数', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('26', '以下符合C语言语法的赋值表达式是（）', '0', null, 'd=9+e+f=d+9', 'd=9+e,f=d+9', 'd=9+e,e++,d+9', 'd=9+e++=d+7', 'A', '17', 'putchar与getchar函数', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('27', 'C语言中的标识符只能由字母、数字和下划线三种字符组成,且第一个字符（）', '0', null, '必须为字母', '必须为下划线', '必须为字母或下划线', '可以是字母,数字和下划线中任一种字符', 'A', '19', '函数的调用', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('28', '以下不正确的叙述是（）', '0', null, '在C程序中,逗号运算符的优先级最低', '在C程序中,APH和aph是两个不同的变量', '若a和b类型相同,在执行了赋值表达式a=b后b中的值将放人a中,而b中的值不变。', '当从键盘输入数据时,对于整型变量只能输入整型数值,对于实型变量只能输入实型数值', 'A', '19', '函数的调用', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('29', 'C语言规定:在一个源程序中,main函数的位置（）', '0', null, '必须在最开始', '必须在系统调用的库函数的后面', '可以任意', '必须在最后', 'A', '13', '三种循环结构', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('30', '若a,b,c,d都是int型变量且初值为0,以下选项中正确的赋值语句是()', '1', null, 'a=b=c=d=100', 'd++', 'c+b', 'd=(c=22)-(b++)', 'A,B,D', '18', '函数的声明', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('31', '以下对C语言中的函数描述不正确的有()', '1', null, '可以嵌套定义,不可以嵌套调用', '不可以嵌套定义,可以嵌套调用', '可以嵌套定义,也可以嵌套调用', '嵌套定义和嵌套调用都不允许', 'A,C,D', '10', '自加自减运算', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('32', '以下关于数组描述错误的是()', '1', null, '数组的大小是固定的,但可以有不同的类型的数组元素', '数组的大小是可变的,但所有数组元素的类型必须相同', '数组的大小是固定的,所有数组元素的类型必须相同', '数组的大小是可变的,可以有不同的类型的数组元素', 'A,B,D', '2', 'main函数', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('33', '在定义int a[2][3];之后,对a的引用正确的有()', '1', null, 'a[0][2]', 'a[1,3]', 'a[1>2][!1]', 'a[2][0]', 'A,C', '23', '字符串赋值', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('34', '以下4个选项中,可以看作是一条语句的有()', '1', null, '{;}', 'a=0,b=0,c=0;', 'if(a>0);', 'if(b==0) m=1;n=2;', 'A,B,C', '13', '三种循环结构', '1', 'C语言程序设计', '32', '广皎洁');
INSERT INTO `choice_error` VALUES ('35', '假设所有变量均为整型,则表达式(a=2,b=5,b++,a+b)的值是（）', '0', null, '7', '8', '6', '2', 'A', '1', 'C程序', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('36', '一个C语言程序是由（）', '0', null, '一个主程序和若干子程序组成', '函数组成', '若干过程组成', '若干子程序组成', 'A', '15', '循环的嵌套', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('37', '以下叙述正确的是（）', '0', null, '在C程序中,main函数必须位于程序的最前面', 'C程序的每行中只能写一条语句', 'C语言本身没有输入输出语句', '在对一个C程序进行编译的过程中,可发现注释中的拼写错误', 'A', '14', 'break与continue', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('38', '在C语言中(以16位PC机为例),5种基本数据类型的存储空间长度的排列顺序为（）', '0', null, 'char<int <1ong int<=float<double', 'char=int<1ong int<=float<double', 'char< int <1ong int=float=double', 'char=int =1ong int<=float<double', 'A', '17', 'putchar与getchar函数', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('39', '下列四组选项中,均不是C语言关键字的选项是（）', '0', null, 'define if type', 'getc char printf', 'include scanf case', 'while go pow', 'A', '12', 'scanf函数', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('40', 'C语言中的标识符只能由字母、数字和下划线三种字符组成,且第一个字符（）', '0', null, '必须为字母', '必须为下划线', '必须为字母或下划线', '可以是字母,数字和下划线中任一种字符', 'A', '19', '函数的调用', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('41', '若x,i,j和k都是int型变量,则执行下面表达式后x的值为（）            x=(i=4,j=16,k=32)', '0', null, '4', '16', '32', '52', 'A', '24', '结构体类型的说明', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('42', '已知各变量的类型说明如下: int k,a,b; unsigned long w= 5; double x=1.42;则以下不符合C语言语法的表达式是（）', '0', null, 'x%(-3)', 'w+=-2', 'k=(a=2,b=3,a+b)', 'a+= a-=(b=4)*(a=3)', 'A', '17', 'putchar与getchar函数', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('43', '下面四个选项中,均是合法整型常量的选项是（）', '0', null, '160', '一0xcdf', '一01', '一0x48a', 'A', '10', '自加自减运算', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('44', '在定义int a[2][3];之后,对a的引用正确的有()', '1', null, 'a[0][2]', 'a[1,3]', 'a[1>2][!1]', 'a[2][0]', 'A,C', '23', '字符串赋值', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('45', '若a,b,c,d都是int型变量且初值为0,以下选项中正确的赋值语句是()', '1', null, 'a=b=c=d=100', 'd++', 'c+b', 'd=(c=22)-(b++)', 'A,B,D', '18', '函数的声明', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('46', '以下选项中不是C语言合法整数的是（）', '1', null, '10110', '0386', '0Xffa', 'x2a2', 'B,D', '18', '函数的声明', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('47', '以下合法的十六进制数是()', '1', null, 'oxff', '0Xabc', '0x01', '0X9X', 'B,C', '16', '位运算符', '1', 'C语言程序设计', '2', '李小涛');
INSERT INTO `choice_error` VALUES ('48', '以下叙述中正确的是()', '1', null, '一个C源程序可由一个或多个函数组成', '一个C源程序必须包含一个main()函数', 'C源程序的基本组成单位是函数', '在C源程序中,注释说明只能位于一条语句的最后', 'A,B,C', '6', '常量与变量', '1', 'C语言程序设计', '2', '李小涛');

-- ----------------------------
-- Table structure for `choice_question`
-- ----------------------------
DROP TABLE IF EXISTS `choice_question`;
CREATE TABLE `choice_question` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_name` varchar(100) DEFAULT NULL COMMENT '题目名称',
  `question_type` int(4) DEFAULT NULL COMMENT '题目类型：0.单选 1多选',
  `question_state` int(4) DEFAULT NULL COMMENT '题目状态：0.可用1.不可用',
  `question_option_a` varchar(100) DEFAULT NULL COMMENT '选项A',
  `question_option_b` varchar(100) DEFAULT NULL COMMENT '选项B',
  `question_option_c` varchar(100) DEFAULT NULL COMMENT '选项C',
  `question_option_d` varchar(100) DEFAULT NULL COMMENT '选项D',
  `correct_option` varchar(10) DEFAULT NULL COMMENT '正确答案',
  `point_id` int(11) DEFAULT NULL COMMENT '所用的知识点id',
  `point_name` varchar(20) DEFAULT NULL,
  `subject_id` int(11) DEFAULT NULL COMMENT '科目id',
  `subject_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of choice_question
-- ----------------------------
INSERT INTO `choice_question` VALUES ('1', '一个C程序的执行是从（）', '0', '0', '本程序的main函数开始,到main函数结束', '本程序文件的第一个函数开始,到本程序文件的最后一个函数结束', '本程序的main函数开始,到本程序文件的最后一个函数结束', '本程序文件的第一个函数开始,到本程序main函数结束', 'A', '8', '算术运算', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('2', '以下叙述正确的是（）', '0', '0', '在C程序中,main函数必须位于程序的最前面', 'C程序的每行中只能写一条语句', 'C语言本身没有输入输出语句', '在对一个C程序进行编译的过程中,可发现注释中的拼写错误', 'A', '14', 'break与continue', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('3', '以下叙述不正确的是（）', '0', '0', '一个C源程序可由一个或多个函数组成', '一个C源程序必须包含一个main函数', 'C程序的基本组成单位是函数', '在C程序中,注释说明只能位于一条语句的后面', 'A', '15', '循环的嵌套', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('4', '在C语言中(以16位PC机为例),5种基本数据类型的存储空间长度的排列顺序为（）', '0', '0', 'char<int <1ong int<=float<double', 'char=int<1ong int<=float<double', 'char< int <1ong int=float=double', 'char=int =1ong int<=float<double', 'A', '17', 'putchar与getchar函数', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('5', '一个C语言程序是由（）', '0', '0', '一个主程序和若干子程序组成', '函数组成', '若干过程组成', '若干子程序组成', 'A', '15', '循环的嵌套', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('6', '下面不正确的字符串常量是（）', '0', '0', '\'abc\'', '\"12\'12\"', '\"0\"', '\"\"', 'A', '6', '常量与变量', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('7', 'C语言规定:在一个源程序中,main函数的位置（）', '0', '0', '必须在最开始', '必须在系统调用的库函数的后面', '可以任意', '必须在最后', 'A', '13', '三种循环结构', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('8', '下列四组选项中,均不是C语言关键字的选项是（）', '0', '0', 'define if type', 'getc char printf', 'include scanf case', 'while go pow', 'A', '12', 'scanf函数', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('9', 'C语言中的标识符只能由字母、数字和下划线三种字符组成,且第一个字符（）', '0', '0', '必须为字母', '必须为下划线', '必须为字母或下划线', '可以是字母,数字和下划线中任一种字符', 'A', '19', '函数的调用', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('10', '假设所有变量均为整型,则表达式(a=2,b=5,b++,a+b)的值是（）', '0', '0', '7', '8', '6', '2', 'A', '1', 'C程序', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('11', '若x,i,j和k都是int型变量,则执行下面表达式后x的值为（）            x=(i=4,j=16,k=32)', '0', '0', '4', '16', '32', '52', 'A', '24', '结构体类型的说明', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('12', '下面四个选项中,均是合法整型常量的选项是（）', '0', '0', '160', '一0xcdf', '一01', '一0x48a', 'A', '10', '自加自减运算', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('13', '下面正确的字符常量是（）', '0', '0', '\"a\"', '\'\\\\\'', '\'W\'', '\'\'', 'A', '11', '逗号运算', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('14', '已知各变量的类型说明如下: int k,a,b; unsigned long w= 5; double x=1.42;则以下不符合C语言语法的表达式是（）', '0', '0', 'x%(-3)', 'w+=-2', 'k=(a=2,b=3,a+b)', 'a+= a-=(b=4)*(a=3)', 'A', '17', 'putchar与getchar函数', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('15', '以下不正确的叙述是（）', '0', '0', '在C程序中,逗号运算符的优先级最低', '在C程序中,APH和aph是两个不同的变量', '若a和b类型相同,在执行了赋值表达式a=b后b中的值将放人a中,而b中的值不变。', '当从键盘输入数据时,对于整型变量只能输入整型数值,对于实型变量只能输入实型数值', 'A', '19', '函数的调用', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('16', '以下正确的叙述是（）', '0', '0', '在C程序中,每行中只能写一条语句', '若a是实型变量,C程序中允许赋值a=10,因此实型变量中允许存放整型数', '在C程序中,无论是整数还是实数,都能被准确无误地表示', '在C程序中,%是只能用于整数运算的运算符', 'A', '16', '位运算符', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('17', '以下符合C语言语法的赋值表达式是（）', '0', '0', 'd=9+e+f=d+9', 'd=9+e,f=d+9', 'd=9+e,e++,d+9', 'd=9+e++=d+7', 'A', '17', 'putchar与getchar函数', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('18', '已知字母A的ASCII码为十进制数65,且c2为字符型,则执行语句c2=\'A\'+\'6\'-\'3\';后,c2中的值为（）', '0', '0', 'D', '68', '不确定的值', 'C', 'A', '4', '书写格式', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('19', '在C语言中,要求运算数必须是整型的运算符是（）', '0', '0', '/', '++', '!=', '%', 'A', '10', '自加自减运算', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('20', '若以下变量均是整型,且num=sum=7;则执行表达式sUM=num++,sUM++,++num后sum的值为（）', '0', '0', '7', '8', '9', '10', 'A', '22', '字符数组', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('21', '以下可以定义为用户标识符的有（）', '1', '0', 'scanf', 'short', '_3com_', 'int', 'A,C', '17', 'putchar与getchar函数', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('22', '以下选项中不是C语言合法整数的是（）', '1', '0', '10110', '0386', '0Xffa', 'x2a2', 'B,D', '18', '函数的声明', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('23', '若a,b,c,d都是int型变量且初值为0,以下选项中正确的赋值语句是()', '1', '0', 'a=b=c=d=100', 'd++', 'c+b', 'd=(c=22)-(b++)', 'A,B,D', '18', '函数的声明', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('24', '以下合法的十六进制数是()', '1', '0', 'oxff', '0Xabc', '0x01', '0X9X', 'B,C', '16', '位运算符', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('25', '以下叙述中正确的是()', '1', '0', '一个C源程序可由一个或多个函数组成', '一个C源程序必须包含一个main()函数', 'C源程序的基本组成单位是函数', '在C源程序中,注释说明只能位于一条语句的最后', 'A,B,C', '6', '常量与变量', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('26', '以下4个选项中,可以看作是一条语句的有()', '1', '0', '{;}', 'a=0,b=0,c=0;', 'if(a>0);', 'if(b==0) m=1;n=2;', 'A,B,C', '13', '三种循环结构', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('27', '以下对C语言中的函数描述不正确的有()', '1', '0', '可以嵌套定义,不可以嵌套调用', '不可以嵌套定义,可以嵌套调用', '可以嵌套定义,也可以嵌套调用', '嵌套定义和嵌套调用都不允许', 'A,C,D', '10', '自加自减运算', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('28', '下列选项中是C语言合法标志符的有()', '1', '0', 'good_morning', 'main', 'stdio.h', '8abc', 'A,B', '9', '强制类型转换', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('29', '在定义int a[2][3];之后,对a的引用正确的有()', '1', '0', 'a[0][2]', 'a[1,3]', 'a[1>2][!1]', 'a[2][0]', 'A,C', '23', '字符串赋值', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('30', '以下关于数组描述错误的是()', '1', '0', '数组的大小是固定的,但可以有不同的类型的数组元素', '数组的大小是可变的,但所有数组元素的类型必须相同', '数组的大小是固定的,所有数组元素的类型必须相同', '数组的大小是可变的,可以有不同的类型的数组元素', 'A,B,D', '2', 'main函数', '1', 'C语言程序设计');
INSERT INTO `choice_question` VALUES ('31', '通常所说的主机是指∶', '0', '0', 'CPU', 'CPU和内存', 'CPU、内存和外存', 'CPU、内存和硬盘', 'B', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('32', '在计算机内部，一切信息的存取、处理和传送的形式是∶', '0', '0', 'ACSII码', 'BCD码', '二进制', '十六进制', 'C', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('33', '软件与程序的区别是∶', '0', '0', '程序价格便宜、软件价格昂贵', '程序是用户自己编写的，而软件是由厂家提供的', '程序是用高级语言编写的，而软件是由机器语言编写的', '软件是程序以及开发、使用和维护所需要的所有文档的总称，而程序只是 软件的一部分', 'D', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('34', '所谓“裸机”是指：', '0', '0', '单片机', '单板机', '不装备任何软件的计算机', '只装备 操作系统的计算机', 'C', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('35', '应用软件是指∶', '0', '0', '所有能够使用的软件', '能被各应用单位共同使用的某种软件', '所有微机上都应使用的基本软件', '专门为某一应用目的而编制的软件', 'D', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('36', 'C语言中的常量可分为整型常量、实型常量、字符型常量及______四种：', '0', '0', '符号常量', '长整型常量', '逻辑常量', '二进制整数', 'A', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('37', '编译程序的功能是∶', '0', '0', '发现源程序中的语法错误', '改正源程序中的语法错误', '将源程序编译成目标程序', '将某一高级语言程序翻译成另一种高 级语言程序', 'C', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('38', '系统软件中最重要的是∶', '0', '0', '操作系统', '语言处理系统', '工具软件', '数据库管理系统', 'A', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('39', '可移植性最好的计算机语言是∶', '0', '0', '机器语言', '汇编语言', '高级语言 ', '自然语言 ', 'C', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('40', '非线性结构是数据元素之间存在一种：', '0', '0', '一对多关系', '多对多关系', '多对一关系', '一对 一关系', 'B', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('41', '数据结构中，与所使用的计算机无关的是数据的____结构', '0', '0', '存储', '物理', '逻辑', '物理和存储', 'C', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('42', '算法分析的目的是：', '0', '0', '找出数据结构的合理性', '研究算法中的输入和输出的关系', '分析算法的效率以求改进', '分析算法的易懂性和文档性 ', 'C', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('43', '算法分析的两个主要方面是：', '0', '0', '空间复杂性和时间复杂性', '正确性和简明性', '可读性和文档性', '数据复杂性和程序复杂性', 'A', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('44', '计算机算法指的是：', '0', '0', '计算方法', '排序方法', '解决问题的有限运算序列', '调 度方法', 'C', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('45', '数据在计算机存储器内表示时，物理地址与逻辑地址相同并且是连续的，称之为：', '0', '0', '存储结构', '逻辑结构', '顺序存储结构', '链式存储结构', 'C', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('46', '在n个结点的顺序表中，算法的时间复杂度是O（1）的操作是：', '0', '0', '访问第i个结点（1≤i≤n）和求第i个结点的直接前驱（2≤i≤n）', '在第i个结点后插入一个新结点（1≤i≤n） ', '删除第i个结点（1≤i≤n） ', '将n个结点从小到大排序 ', 'A', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('47', '线性表若采用链式存储结构时，要求内存中可用存储单元的地址: ', '0', '0', '必须是连续的', '部分地址必须是连续的 ', '一定是不连续的', '连续或不连续都可以', 'D', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('48', '单链表的存储密度 ', '0', '0', '大于1', '等于1', '小于1', '不确定', 'C', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('49', '栈中元素的进出原则是', '0', '0', '先进先出', '后进先出', '栈空则进', '栈满则出', 'B', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('50', '判定一个栈ST（最多元素为m0）为空的条件是', '0', '0', 'ST->top<>0', 'ST->top=0', 'ST->top<>m0 ', 'ST->top=m0', 'B', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('51', '以下说法正确的是', '1', '0', '二叉树的特点是每个结点至多只有两棵子树。', '二叉树的子树无左右之分。', '二叉树只能进行链式存储。', '树的结点包含一个数据元素及若干指向其子树的分支。', 'A,D', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('52', '算法设计的要求包括', '1', '0', '正确性', '可读性', '健壮性', '确定性', 'A,B,C', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('53', '下列说法正确的是', '1', '0', '线性表中数据元素之间仅有线性关系\r\n', '在图形结构中节点之间的关系可以是任意的\r\n', '简单路径中序列中顶点可以重复出现', '邻接表是图的一种链式存储结构', 'A,B,D', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('54', '下列哪些是图的遍历', '1', '0', '深度优先搜索', ' 广度优先搜索\r\n', '先根遍历', ' 中根遍历', 'A,B', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('55', '下列哪一条不是顺序存储结构的优点', '1', '0', '存储密度大', '插入运算方便', '可方便的用于各种逻辑结构的存储表示\r\n', '删除运算方便', 'B,C,D', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('56', '下面关于线性表的叙述正确的是', '1', '0', '线性表采用顺序存储必须占用一片连续的存储空间', '线性表采用链式存储不必占用一片连续的存储空间', '线性表采用链式存储便于插入和删除操作的实现\r\n', '线性表采用顺序存储便于插入和删除操作的实现', 'A,B,C', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('57', ' 线性表的特点正确的', '1', '0', '存在唯一的一个被称作”第一个“的数据元素。', '不存在唯一的一个被称作”第一个“的数据元素。', ' 存在唯一的一个被称作”最后一个“的数据元素。', '不存在唯一的一个被称作”最后一个“的数据元素。', 'A,C', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('58', '下列数据结构中，属于线性数据结构的是', '1', '0', '栈\r\n', ' 队列\r\n', '树\r\n', '图', 'A,B', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('59', '依据所有数据成员之间的逻辑关系的不同，数据结构分为', '1', '0', '非线性结构', '逻辑结构', '物理结构', '线性结构', 'A,D', '25', '数据元素', '2', '数据结构');
INSERT INTO `choice_question` VALUES ('60', '下列属于算法的重要特征的是', '1', '0', '有穷性\r\n', '确定性\r\n', '可行性', '输入和输出', 'A,B,C,D', '25', '数据元素', '2', '数据结构');

-- ----------------------------
-- Table structure for `class`
-- ----------------------------
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class` (
  `class_id` int(11) NOT NULL AUTO_INCREMENT,
  `class_name` varchar(20) DEFAULT NULL COMMENT '班级名称',
  `class_date` varchar(4) DEFAULT NULL COMMENT '入学年份',
  `class_major` varchar(20) DEFAULT NULL COMMENT '所学专业',
  `class_state` int(4) DEFAULT NULL COMMENT '班级是否毕业：0.未毕业1.毕业',
  PRIMARY KEY (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of class
-- ----------------------------
INSERT INTO `class` VALUES ('1', '软件工程1班', '2013', '软件工程', '0');
INSERT INTO `class` VALUES ('2', '软件工程2班', '2013', '软件工程', '0');
INSERT INTO `class` VALUES ('3', '软件工程3班', '2013', '软件工程', '1');
INSERT INTO `class` VALUES ('4', '计科1班', '2012', '计算机科学与技术', '1');
INSERT INTO `class` VALUES ('5', '计科2班', '2012', '计算机科学与技术', '1');
INSERT INTO `class` VALUES ('6', '计科3班', '2012', '计算机科学与技术', '1');

-- ----------------------------
-- Table structure for `essay_question`
-- ----------------------------
DROP TABLE IF EXISTS `essay_question`;
CREATE TABLE `essay_question` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_name` varchar(500) DEFAULT NULL COMMENT '题目名称',
  `question_state` int(4) DEFAULT NULL COMMENT '题目状态：0.可用1.不可用',
  `question_answer` varchar(1000) DEFAULT NULL COMMENT '参考答案',
  `point_id` int(11) DEFAULT NULL COMMENT '拥有知识点id',
  `point_name` varchar(20) DEFAULT NULL,
  `subject_id` int(11) DEFAULT NULL COMMENT '所属科目id',
  `subject_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of essay_question
-- ----------------------------
INSERT INTO `essay_question` VALUES ('1', '将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。', '0', 'int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}', '11', '逗号运算', '1', 'C语言程序设计');
INSERT INTO `essay_question` VALUES ('2', '求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。', '0', 's=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}', '6', '常量与变量', '1', 'C语言程序设计');
INSERT INTO `essay_question` VALUES ('3', '统计字符串中元音字母’a’、’e’、’i’、’o’、’u’的个数并输出。', '0', 'int s=0,i=0;<p>while(str[i]!=‘\\\\0’)<p>{<p>if(str[i]==‘a’ || str[i]==‘e’ || str[i]==‘i’ || str[i]==‘o’ || str[i]==‘u’)<p>s++;<p>i++;<p>}<p>return s;', '7', '整型数据', '1', 'C语言程序设计');
INSERT INTO `essay_question` VALUES ('4', '统计字符串中英文字母的个数并输出。', '0', 'int i=0,s=0;<p>while(str1[i]!=‘\\\\0’)<p>{<p>if((str1[i]>=‘a’ && str1[i]< =‘z’) || (str1[i]>=‘A’ && str1[i]<=‘Z’))<p>s++;<p>i++;<p>}<p>return s;', '4', '书写格式', '1', 'C语言程序设计');
INSERT INTO `essay_question` VALUES ('5', '求[m，n]之间所有不能被3整除的整数之和，m，n的值由键盘输入。', '0', 'int i=0,s=0;<p>for(i=m;i<=n;i++)<p>if(1%3!==0)<p>s=s+i;<p>return s;', '18', '函数的声明', '1', 'C语言程序设计');
INSERT INTO `essay_question` VALUES ('6', '将字符串逆序存放并输出。', '0', 'int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}', '6', '常量与变量', '1', 'C语言程序设计');
INSERT INTO `essay_question` VALUES ('7', '按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n', '0', 'int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}', '7', '整型数据', '1', 'C语言程序设计');
INSERT INTO `essay_question` VALUES ('8', '求[m，n]之间既不能被7整除也不能被5整除的整数之和，m和n的值由键盘输入。', '0', 'int i,s=0;<p>for(i=m;i<=n;i++){<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>return s;<p>}}', '21', '数组元素的引用', '1', 'C语言程序设计');
INSERT INTO `essay_question` VALUES ('9', '按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100', '0', 'int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}', '5', '标识符', '1', 'C语言程序设计');
INSERT INTO `essay_question` VALUES ('10', '求两个整数m和n的最大公约数，m和n的值由键盘输入。', '0', 'int t;<p>t=n%m;<p>if(t!=0)<p>fun(n,t);<p>return m;', '10', '自加自减运算', '1', 'C语言程序设计');
INSERT INTO `essay_question` VALUES ('11', '数据对象是什么', '0', '一个类的事物', '25', '数据元素', '2', '数据结构');
INSERT INTO `essay_question` VALUES ('12', '数据元素是什么', '0', '一个记录', '25', '数据元素', '2', '数据结构');
INSERT INTO `essay_question` VALUES ('13', '数据项是什么', '0', '一个记录的属性', '25', '数据元素', '2', '数据结构');
INSERT INTO `essay_question` VALUES ('14', '数据结构是什么', '0', '是指相互之间存在一种或多种特定关系的数据元素的集合,简单地说是数据之间的各种关系的集合', '25', '数据元素', '2', '数据结构');
INSERT INTO `essay_question` VALUES ('15', '抽象数据类型是什么', '0', '类比于类，自定义类型', '25', '数据元素', '2', '数据结构');
INSERT INTO `essay_question` VALUES ('16', '算法和数据结构是什么关系', '0', '算法和数据结构是密不可分的，因为如果数据结构是一个静态的东西，如果不去应用它，则只是一个很死的东西，因此我们需要算法。', '25', '数据元素', '2', '数据结构');
INSERT INTO `essay_question` VALUES ('17', '算法是什么', '0', '算法是解决特定问题求解步骤的描述，指令的有限序列。', '25', '数据元素', '2', '数据结构');
INSERT INTO `essay_question` VALUES ('18', '算法的设计要求是什么', '0', '(1)正确性：对于合法输入能够得到正确答案，对于非法输入能够得到非法提示；<p>(2)可读性：便于阅读，别人拿到也能够很容易的看懂；<p>(3)健壮性：对于非法输入，需要得到足够的提示，而不是异常；<p>(4)执行速度快、占用存储空间少；', '25', '数据元素', '2', '数据结构');
INSERT INTO `essay_question` VALUES ('19', '大O表示法', '0', '给定运行时间，去除加法常数、只保留最高阶项、去掉最高阶项的常数，就得到大O表示法', '25', '数据元素', '2', '数据结构');
INSERT INTO `essay_question` VALUES ('20', '算法的特性', '0', '(1)输入输出：算法需要有输入和输出；<p>(2)有穷性：执行有限时间后完毕，此处的有限时间指的是你期望的时间；<p>(3)确定性：在输入相同的前提下，输出要唯一；<p>(4)可行性：能够运行出结果；', '25', '数据元素', '2', '数据结构');

-- ----------------------------
-- Table structure for `exam`
-- ----------------------------
DROP TABLE IF EXISTS `exam`;
CREATE TABLE `exam` (
  `exam_id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_no` varchar(20) DEFAULT NULL COMMENT '考试编号',
  `exam_name` varchar(20) DEFAULT NULL COMMENT '考试名称',
  `radio_num` int(4) DEFAULT NULL COMMENT '单选题数量',
  `radio_score` int(4) DEFAULT NULL COMMENT '每道单选题分数',
  `check_num` int(4) DEFAULT NULL COMMENT '多选题数量',
  `check_score` int(4) DEFAULT NULL COMMENT '每道多选题分数',
  `judge_num` int(4) DEFAULT NULL COMMENT '判断题数量',
  `judge_score` int(4) DEFAULT NULL COMMENT '判断题分数',
  `essay_num` int(4) DEFAULT NULL COMMENT '主观题数量',
  `essay_score` int(4) DEFAULT NULL COMMENT '每道主观题分数',
  `class_id` int(11) DEFAULT NULL COMMENT '安排考试的班级',
  `class_name` varchar(20) DEFAULT NULL COMMENT '班级名称',
  `exam_date` date DEFAULT NULL COMMENT '考试日期',
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `exam_time` int(4) DEFAULT NULL COMMENT '考试时长（单位：分钟）',
  `exam_state` int(4) DEFAULT NULL COMMENT '考试状态：0.可考试1.作废',
  `room_id` int(11) DEFAULT NULL COMMENT '考试教室id',
  `room_name` varchar(20) DEFAULT NULL COMMENT '教室名称',
  `subject_id` int(11) DEFAULT NULL COMMENT '考试科目',
  `subject_name` varchar(20) DEFAULT NULL COMMENT '科目名称',
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`exam_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of exam
-- ----------------------------
INSERT INTO `exam` VALUES ('1', '20130001', '2015-2016第一学期C语言程序设计', '10', '2', '5', '4', '10', '2', '5', '8', '1', '软件工程1班', '2017-05-08', '00:00:00', '23:59:00', '90', '0', '1', '10521', '1', 'C语言程序设计', '2', '张建龙');
INSERT INTO `exam` VALUES ('2', '20130002', '2015-2016第二学期C语言程序设计', '10', '2', '5', '4', '10', '2', '5', '8', '1', '软件工程1班', '2017-05-09', '00:00:00', '23:59:00', '90', '0', '1', '10521', '1', 'C语言程序设计', '3', '王文田');
INSERT INTO `exam` VALUES ('3', '2013003', '2016-2017第一学期C语言程序设计', '10', '2', '5', '2', '10', '2', '2', '25', '1', '软件工程1班', '2017-05-15', '07:00:00', '23:00:00', '120', '0', '2', '10505', '1', 'C语言程序设计', '2', '张建龙');

-- ----------------------------
-- Table structure for `judge_question`
-- ----------------------------
DROP TABLE IF EXISTS `judge_question`;
CREATE TABLE `judge_question` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '判断题id',
  `question_name` varchar(100) DEFAULT NULL COMMENT '判断题名称',
  `correct_answer` varchar(4) DEFAULT NULL COMMENT '判断题答案 T正确 F错误',
  `point_id` int(11) DEFAULT NULL COMMENT '知识点id',
  `point_name` varchar(20) DEFAULT NULL COMMENT '知识点name',
  `subject_id` int(11) DEFAULT NULL COMMENT '科目id',
  `subject_name` varchar(20) DEFAULT NULL COMMENT '科目name',
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of judge_question
-- ----------------------------
INSERT INTO `judge_question` VALUES ('1', '在C语言中，各种类型的整型数据在内存中都占2个字节。', 'F', '19', '函数的调用', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('2', '表达式 (j=3, j++) 的值是4。', 'F', '13', '三种循环结构', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('3', '格式字符%e以指数形式输出实数数字部分小数位数7位.', 'F', '5', '标识符', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('4', 'char c[6]=\"abcde\"; printf(\"%3s\", c)表示输出的字段的宽度为3位,如果被输出的数据的位数大于3,只输出3位数.', 'F', '15', '循环的嵌套', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('5', '设d=1,e=2,f=3,则逻辑表达 式!(d+e)+f&&e+f*2的值为0.', 'F', '2', 'main函数', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('6', '已知a=1,b=2,c=3,d=4,则条件表达式a>b?a:(c>d?c:d)的值为4.', 'T', '1', 'C程序', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('7', '已知a=3,b=4,c=5.则逻辑表达式a+b>c && b==c值为0 .', 'T', '3', '存储形式', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('8', 'do-while循环由do开始,while结束,循环体可能一次也不做。', 'F', '14', 'break与continue', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('9', '对于for(表达式1;表达式2;表达式3)语句来说,continue语句意味着转去执行表达式2.', 'F', '16', '位运算符', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('10', '在do-while循环中,任何情况下都不能省略while.', 'T', '11', '逗号运算', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('11', '对静态变量的初始化不是在编译阶段完成的.', 'F', '18', '函数的声明', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('12', '定义 int x[5],n;则x=x+n;或x++;都是正确的。', 'F', '12', 'scanf函数', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('13', '语句 char ch[12]={\"C Program\"};与语句 char ch[ ]=\"C Program\";具有不同的赋初值功能.', 'F', '5', '标识符', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('14', '数组名作为函数调用时的实参,实际上传递给形参的是数组第一个元素的值.', 'F', '16', '位运算符', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('15', '变量根据其作用域的范围可以分作局部变量和全局变量。', 'T', '15', '数据元素', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('16', '当变量的存储类型定义缺省时,系统默认为变量的存储类型为auto类型,分配在静态区.', 'F', '7', '整型数据', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('17', '若有宏定义：#define S(a,b) t=a;a=b;b=t由于变量t没定义，所以此宏定义是错误的。', 'F', '10', '自加自减运算', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('18', '设有如下定义:int *p; *p=100;则 printf(\"%d\",p); 的输出结果是100.', 'F', '18', '函数的声明', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('19', '使几个不同的变量共占同一段内存的结构,称为\"结构体\"类型.', 'F', '15', '循环的嵌套', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('20', '在C程序中,%是只能用于整数运算的运算符', 'F', '22', '字符数组', '1', 'C语言程序设计');
INSERT INTO `judge_question` VALUES ('21', '线性表的逻辑顺序总是与其物理顺序一致。', 'F', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('22', '线性表的顺序存储优于链式存储。', 'F', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('23', '在长度为n的顺序表中，求第i个元素的直接前驱算法的时间复杂度为0（1）', 'T', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('24', '若一棵二叉树中的结点均无右孩子，则该二叉树的中根遍历和后根遍历序列正好相反。', 'F', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('25', '顺序表和一维数组一样，都可以按下标随机（或直接）访问。', 'T', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('26', '内部排序是指排序过程在内存中进行的排序。', 'T', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('27', ' 当待排序序列初始有序时，简单选择排序的时间复杂性为O(n)', 'F', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('28', '用邻接矩阵存储一个图时，在不考虑压缩存储的情 况下，所占用的存储空间大小只与图中的顶点个数有关，而与图的边数无关。', 'T', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('29', '任何一棵二叉树的叶结点在三种遍历中的相对次序是不变的', 'T', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('30', ' 若将一批杂乱无章的数据按堆结构组织起来, 则堆中数据必然按从小到大的顺序线性排列。', 'F', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('31', '如果采用如下方法定义一维字符数组：      int maxSize = 30;      char * a = new char[maxSize];      则这种数组在程序执行过程中不能扩充。', 'F', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('32', '使用三元组表示稀疏矩阵中的非零元素能节省存储空间。', 'T', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('33', '对稀疏矩阵进行压缩存储是为了节省存储空间。', 'T', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('34', '当向一个最小堆插入一个具有最小值的元素时，该 元素需要逐层向上调整，直到被调整到堆顶位置为止。', 'T', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('35', ' 哈希查找法中解决冲突问题的常用方法是除留余数法。', 'F', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('36', '对具有n个结点的堆进行插入一个元素运算的时间复杂度为O(n)。', 'F', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('37', ' 堆排序是一种稳定的排序算法。', 'F', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('38', '如果有向图中各个顶点的度都大于2，则该图中必有回路。', 'F', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('39', '在一个顺序存储的循环队列中, 队头指针指向队头元素的后一个位置。', 'F', '25', '数据元素', '2', '数据结构');
INSERT INTO `judge_question` VALUES ('40', ' 对平衡二叉树进行中根遍历，可得到结点的有序排列。', 'T', '25', '数据元素', '2', '数据结构');

-- ----------------------------
-- Table structure for `point`
-- ----------------------------
DROP TABLE IF EXISTS `point`;
CREATE TABLE `point` (
  `point_id` int(11) NOT NULL AUTO_INCREMENT,
  `point_name` varchar(20) DEFAULT NULL COMMENT '知识点名',
  `subject_id` int(11) DEFAULT NULL COMMENT '所属科目id',
  `subject_name` varchar(20) DEFAULT NULL,
  `point_content` varchar(500) DEFAULT NULL COMMENT '知识点内容',
  PRIMARY KEY (`point_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of point
-- ----------------------------
INSERT INTO `point` VALUES ('1', 'C程序', '1', 'C语言程序设计', '用C语言编写的程序称为C语言源程序，源程序文件的后缀名为“.c”。源程序经编译后生成后缀名为“.obj”的目标文件，再把目标文件与各种库函数连接起来，生成“.exe”可执行文件。C语言有三种基本结构：顺序结构、选择结构、循环结构。');
INSERT INTO `point` VALUES ('2', 'main函数', '1', 'C语言程序设计', '又称主函数，是C程序的入口。main后面跟一对小括号和一对花括号，花括号括起来的部分称为main函数的函数体。一个C程序从main函数开始执行，到main函数体执行完结束，而不论main函数在整个程序中的位置如何。');
INSERT INTO `point` VALUES ('3', '存储形式', '1', 'C语言程序设计', '计算机在电脑中保存数据是采用二进制形式，由0或1构成的二进制称为位（bit），八个位构成一个字节（Byte），1个Byte=8个bit。二进制、八进制、十六进制转化为十进制采用乘法，十进制转化为二进制、八进制、十六进制采用除法。');
INSERT INTO `point` VALUES ('4', '书写格式', '1', 'C语言程序设计', '每条语句的后面必须有一个分号，分号是语句的一部分。一行内可写多条语句，一个语句可写在多行上。');
INSERT INTO `point` VALUES ('5', '标识符', '1', 'C语言程序设计', '是标识名字的有效字符序列，可以理解为C程序中的单词。');
INSERT INTO `point` VALUES ('6', '常量与变量', '1', 'C语言程序设计', '常量是指在程序运行过程中，其值不能改变的量。常量分为整型常量、实型常量、字符常量、字符串常量、符号常量5种。在程序运行过程中其值可以改变的量称为变量。');
INSERT INTO `point` VALUES ('7', '整型数据', '1', 'C语言程序设计', '整型常量有十进制、八进制、十六进制三种表示形式，没有二进制形式。八进制整型常量加前导数字0，十六进制常量加前导0X，八进制常量中不会出现8。');
INSERT INTO `point` VALUES ('8', '算术运算', '1', 'C语言程序设计', '算术运算符一共有+、—、*、/、%这五个。求余运算要求运算对象只能为整型，除法运算符两边运算对象都为整型时，运算结果也为整型即舍掉小数部分。');
INSERT INTO `point` VALUES ('9', '强制类型转换', '1', 'C语言程序设计', '将一个运算对象转换成指定类型，格式为（类型名）表达式，注意小括号位置。');
INSERT INTO `point` VALUES ('10', '自加自减运算', '1', 'C语言程序设计', '自加运算符“++”与自减运算符“--”是单目运算符，运算对象必须是变量。自增自减运算分前缀运算和后缀运算，它们所对应的表达式的值是有区别的，如j=i++;等价于j=i;i=i+1;而j=++i;等价于i=i+1;j=i;。');
INSERT INTO `point` VALUES ('11', '逗号运算', '1', 'C语言程序设计', '逗号运算符运算优先级最低，可将多个表达式构成一个新的表达式。');
INSERT INTO `point` VALUES ('12', 'scanf函数', '1', 'C语言程序设计', '输入项要求带取地址符&。当用键盘输入多个数据时，数据之间用分隔符。分隔符包括空格符、制表符和回车符，但不包括逗号。');
INSERT INTO `point` VALUES ('13', '三种循环结构', '1', 'C语言程序设计', '三种循环结构分别为：while，do-while，for，三种结构的格式及执行顺序详见教材第36、39、40页。注意for循环中的小括号中必须是两个分号；循环一定要有结束条件，否则成了死循环；do-while()循环最后的while()；后一定要有分号。');
INSERT INTO `point` VALUES ('14', 'break与continue', '1', 'C语言程序设计', 'break是终止所在整个循环，而continue是提前结束本轮循环。break语句可出现在循环结构与switch语句中，continue只出现在循环结构中。');
INSERT INTO `point` VALUES ('15', '循环的嵌套', '1', 'C语言程序设计', '就是循环里面还有循环，计算要一层一层分析，一般只考查两层嵌套，循环嵌套通常是处理二维数组。');
INSERT INTO `point` VALUES ('16', '位运算符', '1', 'C语言程序设计', 'C语言提供6种位运算符：按位求反~，按位左移<<，按位右移>>，按位与&，按位异或|，按位或^。一般情况下需要先转化进制。异或运算的规则：0异或1得到1，0异或0得到0，1异或1得到0。可记为“相同为0，不同为1”。');
INSERT INTO `point` VALUES ('17', 'putchar与getchar函数', '1', 'C语言程序设计', '可用于输出或输入单个字符，这两个函数是stdio.h文件中的库函数，它们是printf与scanf函数的简化。');
INSERT INTO `point` VALUES ('18', '函数的声明', '1', 'C语言程序设计', '函数要“先定义后调用”，或“先声明再调用后定义”。函数的声明一定要有函数名、函数返回值类型、函数参数类型，但不一定要有形参的名称。');
INSERT INTO `point` VALUES ('19', '函数的调用', '1', 'C语言程序设计', '程序从上往下执行，当碰到函数名后，把值传给调用函数，当程序得到了返回值或调用函数结束，再顺序往下执行。');
INSERT INTO `point` VALUES ('20', '函数的递归调用', '1', 'C语言程序设计', '函数直接或间接地调用自己称为函数的递归调用。递归调用必须有一个明确的结束递归的条件。');
INSERT INTO `point` VALUES ('21', '数组元素的引用', '1', 'C语言程序设计', '数组元素的下标从0开始，到数组长度减1结束。所以int a[5];中数组最后一个元素是a[4]。要把数组元素看作一个整体，可以把a[4]当作一个整型变量。');
INSERT INTO `point` VALUES ('22', '字符数组', '1', 'C语言程序设计', 'C语言没有字符串变量，只能采用字符数组来存储字符串。数组的大小应该比它将要实际存放的最长字符串多一个元素，从而存放’\\0’。');
INSERT INTO `point` VALUES ('23', '字符串赋值', '1', 'C语言程序设计', '可以用下面的形式进行赋值：char str[]=”Hello!”;或char *p;p=”Hello!”;，但不能用下面的形式：char str[10];str=”Hello”;因为str是一个地址常量，不能进行赋值操作。');
INSERT INTO `point` VALUES ('24', '结构体类型的说明', '1', 'C语言程序设计', '结构体是若干个类型数据的集合，结构体类型说明格式如下：struct 类型名 {类型1 成员名1;类型2 成员名2;……};');
INSERT INTO `point` VALUES ('25', '数据元素', '2', '数据结构', '数据元素是数据的基本单位，在计算机程序中通常作为一个整体进行考虑和处理。');

-- ----------------------------
-- Table structure for `room`
-- ----------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room` (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `room_name` varchar(20) DEFAULT NULL COMMENT '教室名称',
  `room_state` int(4) DEFAULT NULL COMMENT '教室可用状态：0.可用1.不可用',
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of room
-- ----------------------------
INSERT INTO `room` VALUES ('1', '10521', '0');
INSERT INTO `room` VALUES ('2', '10505', '0');
INSERT INTO `room` VALUES ('3', '10555', '0');

-- ----------------------------
-- Table structure for `score`
-- ----------------------------
DROP TABLE IF EXISTS `score`;
CREATE TABLE `score` (
  `score_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '分数id',
  `score_choice` int(4) DEFAULT NULL COMMENT '选择题判断题分数',
  `score_essay` int(4) DEFAULT NULL COMMENT '主观题分数',
  `essay_question` varchar(5000) DEFAULT NULL COMMENT '主观题回答部分（问题，回答，参考答案）',
  `essay_state` int(4) DEFAULT NULL COMMENT '主观题是否已经批改：0.未批改1.已批改',
  `score_sum` int(4) DEFAULT NULL COMMENT '总分',
  `student_id` int(11) DEFAULT NULL COMMENT '学生id',
  `student_no` varchar(20) DEFAULT NULL,
  `student_name` varchar(20) DEFAULT NULL COMMENT '学生姓名',
  `exam_id` int(11) DEFAULT NULL COMMENT '考试id',
  `exam_name` varchar(20) DEFAULT NULL COMMENT '考试名称',
  `subject_id` int(11) DEFAULT NULL COMMENT '科目id',
  `subject_name` varchar(20) DEFAULT NULL COMMENT '科目名称',
  `class_id` int(11) DEFAULT NULL COMMENT '班级id',
  `class_name` varchar(20) DEFAULT NULL COMMENT '班级名称',
  `submit_time` datetime DEFAULT NULL COMMENT '提交时间',
  PRIMARY KEY (`score_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of score
-- ----------------------------
INSERT INTO `score` VALUES ('1', '32', '30', '简答题一共5道，每道题8分。<p>将字符串逆序存放并输出。<p>答：<p>int a;</p><p>int b;</p><p>int c;</p><p>for(int i = 0;i&lt;10;i++){</p><p>}</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>统计字符串中元音字母’a’、’e’、’i’、’o’、’u’的个数并输出。<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>while(str[i]!=‘\\\\0’)<p>{<p>if(str[i]==‘a’ || str[i]==‘e’ || str[i]==‘i’ || str[i]==‘o’ || str[i]==‘u’)<p>s++;<p>i++;<p>}<p>return s;<p><p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>xiix</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>houhou</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>统计字符串中英文字母的个数并输出。<p>答：<p>gaga</p><p>参考答案：<p>int i=0,s=0;<p>while(str1[i]!=‘\\\\0’)<p>{<p>if((str1[i]>=‘a’ && str1[i]< =‘z’) || (str1[i]>=‘A’ && str1[i]<=‘Z’))<p>s++;<p>i++;<p>}<p>return s;<p><p>', '1', '62', '1', '20130101', '宋小明', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 12:59:01');
INSERT INTO `score` VALUES ('2', '32', '20', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '52', '2', '20130102', '李小涛', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:02:57');
INSERT INTO `score` VALUES ('3', '42', '25', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '67', '3', '20130103', '王晓丽', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('4', '36', '30', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '66', '4', '20130104', '周秋秾', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('5', '56', '37', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '93', '5', '20130105', '张智鑫', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('6', '54', '36', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '90', '6', '20130106', '张皓封', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('7', '20', '40', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '60', '7', '20130107', '巫昭达', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('8', '34', '29', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '63', '8', '20130108', '孙东汐', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('9', '46', '38', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '84', '9', '20130109', '王充瑛', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('10', '42', '40', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '82', '10', '201301010', '余仲埂', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('11', '40', '25', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '65', '11', '201301011', '刘军琪', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('12', '38', '15', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '53', '12', '201301012', '卓北凡', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('13', '36', '38', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '74', '13', '201301013', '蔡炜伍', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('14', '36', '40', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '76', '14', '201301014', '林明贯', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('15', '36', '20', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '56', '15', '201301015', '卫怡雪', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('16', '38', '27', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '65', '16', '201301016', '朱小香', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('17', '51', '40', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '91', '17', '201301017', '柳春芬', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('18', '56', '34', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '90', '18', '201301018', '薛菁芸', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('19', '34', '28', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '62', '19', '201301019', '陈丽华', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('20', '46', '22', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '68', '20', '201301020', '金恬', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('21', '32', '26', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '58', '21', '201301021', '张锦娜', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('22', '38', '30', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '68', '22', '201301022', '冯菡锦', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('23', '32', '22', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '54', '23', '201301023', '苏锦', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('24', '38', '37', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '75', '24', '201301024', '彭菁燕', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('25', '36', '38', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '74', '25', '201301025', '王海', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('26', '32', '32', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '64', '26', '201301026', '孙静', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('27', '32', '19', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '51', '27', '201301027', '金珠恬', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('28', '32', '21', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '53', '28', '201301028', '元妙苹', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('29', '32', '36', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '68', '29', '201301029', '马芝宏', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('30', '32', '35', '简答题一共5道，每道题8分。<p>求[1，1000]之间既不能被7整除也不能被5整除的整数之和，将结果存入变量s中。<p>答：<p>haha</p><p>参考答案：<p>s=0;<p>for(i=1;i<=1000;i++)<p>if(i%5!=0 && i%7!=0){<p>s=s+i;<p>}<p><p>将字符串中所有的大写字母转换为小写，其它字符不变（不使用转换函数）。<p>答：<p>xixi</p><p>参考答案：<p>int i=0;<p>while(str1[i]!=‘\\\\0’){<p>if (str1[i]>=‘A’ && str1[i]<=‘Z’)<p>str1[i]+=32;<p>else{<p>i++;<p>}}<p><p>将字符串逆序存放并输出。<p>答：<p>houhou</p><p>参考答案：<p>int i=0,j;<p>char str2[80];<p>while(str1[i]!=‘\\\\0’){<p>str2[i]=str1[i];<p>i++;<p>}<p>for(j=0;j<i;j++){<p>str1[j]=str2[i-1-j];<p>}<p><p>按下面的公式求sum的值。 sum=m+(m+1)+(m+2)+(m+3)+……+(n-1)+n<p>答：<p>haha</p><p>参考答案：<p>int s=0,i=0;<p>for(i=m;i<=n;i++){<p>s=s+i;<p>return s;<p>}<p><p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>hah</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>', '1', '67', '30', '201301030', '云芬', '1', '2015-2016第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-08 13:13:43');
INSERT INTO `score` VALUES ('31', '5', '25', '简答题一共2道，每道题25分。<p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>就看电视费</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>统计字符串中英文字母的个数并输出。<p>答：<p>京津冀</p><p>参考答案：<p>int i=0,s=0;<p>while(str1[i]!=‘\\\\0’)<p>{<p>if((str1[i]>=‘a’ && str1[i]< =‘z’) || (str1[i]>=‘A’ && str1[i]<=‘Z’))<p>s++;<p>i++;<p>}<p>return s;<p><p>', '1', '30', '32', '20130202', '广皎洁', '3', '2016-2017第一学期C语言程序设计', '1', 'C语言程序设计', '2', '软件工程2班', '2017-05-10 13:22:44');
INSERT INTO `score` VALUES ('32', '10', null, '简答题一共2道，每道题25分。<p>按下面的公式求sum的值。 sum=1-2+3-4+5-6+……+99-100<p>答：<p>int a;</p><p>int b;</p><p>参考答案：<p>int i,j=1;<p>sum=0;<p>for(i=1;i<=100;i++)<p>{<p>sum=sum+i*j;<p>j=-j;<p>}<p><p>统计字符串中英文字母的个数并输出。<p>答：<p>haha</p><p>参考答案：<p>int i=0,s=0;<p>while(str1[i]!=‘\\\\0’)<p>{<p>if((str1[i]>=‘a’ && str1[i]< =‘z’) || (str1[i]>=‘A’ && str1[i]<=‘Z’))<p>s++;<p>i++;<p>}<p>return s;<p><p>', '0', '10', '2', '20130102', '李小涛', '3', '2016-2017第一学期C语言程序设计', '1', 'C语言程序设计', '1', '软件工程1班', '2017-05-13 08:52:25');

-- ----------------------------
-- Table structure for `student`
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `student_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_no` varchar(20) DEFAULT NULL COMMENT '学号',
  `student_name` varchar(20) DEFAULT NULL COMMENT '姓名',
  `student_pass` varchar(50) DEFAULT NULL COMMENT '密码',
  `student_sex` int(4) DEFAULT NULL COMMENT '性别',
  `student_birth` date DEFAULT NULL COMMENT '生日',
  `student_phone` varchar(20) DEFAULT NULL COMMENT '电话',
  `student_email` varchar(30) DEFAULT NULL COMMENT '邮箱',
  `student_state` int(4) DEFAULT NULL COMMENT '学生状态：0.在校1.离校',
  `class_id` int(11) DEFAULT NULL COMMENT '班级',
  `class_name` varchar(20) DEFAULT NULL COMMENT '班级名称',
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of student
-- ----------------------------
INSERT INTO `student` VALUES ('1', '20130101', '宋小明', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15758595685', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('2', '20130102', '李小涛', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '14758569235', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('3', '20130103', '王晓丽', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-14', '14758598562', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('4', '20130104', '周秋秾', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15474558459', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('5', '20130105', '张智鑫', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15745856985', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('6', '20130106', '张皓封', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '14758569854', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('7', '20130107', '巫昭达', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '12547856932', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('8', '20130108', '孙东汐', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('9', '20130109', '王充瑛', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('10', '20130110', '余仲埂', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('11', '20130111', '刘军琪', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('12', '20130112', '卓北凡', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('13', '20130113', '蔡炜伍', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('14', '20130114', '林明贯', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('15', '20130115', '卫怡雪', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('16', '20130116', '朱小香', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('17', '20130117', '柳春芬', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('18', '20130118', '薛菁芸', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('19', '20130119', '陈丽华', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('20', '20130120', '金恬', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('21', '20130121', '张锦娜', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('22', '20130122', '冯菡锦', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('23', '20130123', '苏锦', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('24', '20130124', '彭菁燕', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('25', '20130125', '王海', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('26', '20130126', '孙静', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('27', '20130127', '金珠恬', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('28', '20130128', '元妙苹', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('29', '20130129', '马芝宏', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('30', '20130130', '云芬', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-05', '15756291125', '521478569@qq.com', '0', '1', '软件工程1班');
INSERT INTO `student` VALUES ('31', '20130201', '荀云飞', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '13845875962', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('32', '20130202', '广皎洁', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('33', '20130203', '商迎秋', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('34', '20130204', '席夏山', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('35', '20130205', '厉家美', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('36', '20130206', '门安娜', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('37', '20130207', '宁访文', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('38', '20130208', '赛丹丹', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('39', '20130209', '祢勇毅', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('40', '20130210', '阮问儿', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('41', '20130211', '郑虹英', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('42', '20130212', '元曼凡', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('43', '20130213', '贰丁兰', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('44', '20130214', '俟依云', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('45', '20130215', '库书慧', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('46', '20130216', '鲁骏俊', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('47', '20130217', '城语心', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('48', '20130218', '沙阳阳', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('49', '20130219', '仁韶容', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('50', '20130220', '毛芳华', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('51', '20130221', '水自珍', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('52', '20130222', '苏沛儿', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('53', '20130223', '水自珍', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('54', '20130224', '何香岚', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('55', '20130225', '单代桃', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('56', '20130226', '项凡白', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('57', '20130227', '赫连千易', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('58', '20130228', '古以冬', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('59', '20130229', '彭幻儿', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');
INSERT INTO `student` VALUES ('60', '20130230', '马佳雪曼', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '1995-07-28', '15478569852', '214568542@qq.com', '0', '2', '软件工程2班');

-- ----------------------------
-- Table structure for `subject`
-- ----------------------------
DROP TABLE IF EXISTS `subject`;
CREATE TABLE `subject` (
  `subject_id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_name` varchar(20) DEFAULT NULL COMMENT '科目名称',
  `subject_state` int(4) DEFAULT NULL COMMENT '科目状态：0.可用1.不可用',
  `subject_content` varchar(500) DEFAULT NULL COMMENT '科目备注',
  PRIMARY KEY (`subject_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of subject
-- ----------------------------
INSERT INTO `subject` VALUES ('1', 'C语言程序设计', '0', '本科目从初学者的角度出发，以通俗易懂的语言，丰富多彩的实例，详细介绍了使用C语言进行程序开发应该掌握的各方面知识。全书共分17章，包括C语言概述、算法、数据类型、运算符与表达式、常用的数据输入/输出函数、选择结构程序设计、循环控制、数组、函数、指针、结构体和共用体、位运算、预处理、文件、存储管理、网络套接字编程和学生成绩管理系统。');
INSERT INTO `subject` VALUES ('2', '数据结构', '0', '数据结构是计算机存储、组织数据的方式。数据结构是指相互之间存在一种或多种特定关系的数据元素的集合。通常情况下，精心选择的数据结构可以带来更高的运行或者存储效率。数据结构往往同高效的检索算法和索引技术有关。');
INSERT INTO `subject` VALUES ('3', 'Web开发技术', '0', 'Web技术涉及的内容相当广泛，本书涵盖了其中诸多方面，如：HTML标识语言、Java、Applet、CGI、脚本语言、ASP和JSP技术等。本书取材得当、覆盖面广、实例丰富、图文并茂，既可作为计算机专业本、专科学生学习和掌握Web技术的教科书，也可以作为广大 Web技术爱好者学习和应用Web技术的参考书。');
INSERT INTO `subject` VALUES ('4', 'Java开发与应用', '0', 'Java语言作为静态面向对象编程语言的代表，极好地实现了面向对象理论。Java是一种可以撰写跨平台应用软件的面向对象的程序设计语言，是由Sun Microsystems公司于1995年5月推出的Java程序设计语言和Java平台（即JavaSE, JavaEE, JavaME）的总称。Java 技术具有卓越的通用性、高效性、平台移植性和安全性，广泛应用于个人PC、数据中心、游戏控制台、科学超级计算机、移动电话和互联网，同时拥有全球最大的开发者专业社群。在全球云计算和移动互联网的产业环境下，Java更具备了显著优势和广阔前景。');
INSERT INTO `subject` VALUES ('5', '大学英语1', '0', '大学英语课程教学是大学教育的重要组成部分，是我院非英语专业本科教育的一门必修基础课程。其首要任务是注重学生语言综合运用能力，尤其是听说能力的培养和提高，使他们在今后的工作和社会交往中能运用英语有效地进行口头和书面的信息交流，同时，增强其自主学习能力，提高其综合文化素养，以适应我国经济发展和国际交流的需要。');
INSERT INTO `subject` VALUES ('6', '中国近现代史纲要', '0', '为了充分反映党的十八大精神与近年来党的理论创新、实践创新的成果，并进一步吸收高校师生在教材使用过程中提出的意见和建议，根据中宣部、教育部的安排，《中国近现代史纲要》教材编写课题组在2013年上半年对教材再次进行了修订。教材的修订工作得到了马克思主义理论研究和建设工程咨询委员会的指导。马克思主义理论研究和建设工程办公室对教材进行了审核。');
INSERT INTO `subject` VALUES ('7', '数据库系统原理与设计', '0', '该书注重数据库应用与设计能力的培养，将数据库设计的内容分散在不同章节逐层推进。介绍了数据库系统的产生与发展、数据库系统的特点、数据库系统的基本概念、关系数据库、关系数据库方法等内容，还给出一个综合实例。');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `login_name` varchar(20) DEFAULT NULL COMMENT '工号',
  `user_name` varchar(20) DEFAULT NULL COMMENT '用户真实姓名',
  `user_pass` varchar(50) DEFAULT NULL COMMENT '登录密码',
  `user_sex` int(4) DEFAULT NULL COMMENT '性别',
  `user_phone` varchar(20) DEFAULT NULL COMMENT '电话',
  `user_email` varchar(30) DEFAULT NULL COMMENT '邮箱',
  `user_type` int(4) DEFAULT NULL COMMENT '用户类型：0.系统管理员1.老师',
  `user_state` int(4) DEFAULT NULL COMMENT '用户可用状态：0.在职1.离职',
  `user_detail` varchar(100) DEFAULT NULL COMMENT '用户描述',
  `subject_id` int(11) DEFAULT NULL,
  `subject_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '10001', '李毛儿', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '15756291222', '111@qq.com', '0', '0', '一位管理员', null, null);
INSERT INTO `user` VALUES ('2', '10002', '张建龙', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '15756291222', '222@qq.com', '1', '0', '一位C语言老师', '1', 'C语言程序设计');
INSERT INTO `user` VALUES ('3', '10003', '王文田', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '15555568549', '111@qq.com', '1', '0', '一位C语言老师', '1', 'C语言程序设计');
INSERT INTO `user` VALUES ('4', '10004', '苏悠然', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '15478595858', '111@qq.com', '1', '0', '一位数据结构老师', '2', '数据结构');
INSERT INTO `user` VALUES ('5', '10005', '韩维', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '15756291222', '111@qq.com', '1', '0', '一位数据结构老师', '2', '数据结构');
INSERT INTO `user` VALUES ('6', '10006', '谢兰花', 'DC483E80A7A0BD9EF71D8CF973673924', '1', '15756291222', '111@qq.com', '1', '0', '一位web老师', '3', 'Web开发技术');
INSERT INTO `user` VALUES ('7', '10007', '何曾宝', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '15756291222', '222@qq.com', '1', '0', '一位java老师', '4', 'Java开发与应用');
INSERT INTO `user` VALUES ('8', '10008', '邓成天', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '15555568549', '111@qq.com', '1', '0', '一位英语老师', '5', '大学英语1');
INSERT INTO `user` VALUES ('9', '10009', '余瑞', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '15478595858', '111@qq.com', '1', '0', '一位历史老师', '6', '中国近现代史纲要');
INSERT INTO `user` VALUES ('10', '10010', '袁凯', 'DC483E80A7A0BD9EF71D8CF973673924', '0', '15756291222', '111@qq.com', '1', '0', '一位数据库老师', '7', '数据库系统原理与设计');
