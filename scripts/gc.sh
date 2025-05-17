#! /bin/bash
# 快速生成模板

set -e

FILE_PATH="$(pwd)/src"

# 待创建的名称
NAME=$1

# 自定义函数名称
function customName(){
    if [[ -n $NAME ]]; then return; fi;
    msg="请输入名称："
    if [[ -n $1 ]]; then
        msg=$1
    fi
    read -p "$msg" name
    if [[ -z $name ]]
    then
        customName "名称不能为空，请重新输入名称："
    fi
    NAME=$name
}

# 执行开始 -- start
# 确保脚本抛出遇到的错误
echo '按下 <CTRL-D> 退出'

# 获取创建的名称
customName
echo "你创建的名称是：${NAME}"
# 生成文件
cd $FILE_PATH
if [[ -d $NAME ]];
then
    echo "该混合已经存在，请检查~"
else

# 在当前目录下面修改index.css (追加抛出)
echo "@import './${NAME}';" >> index.scss

# 创建文件
touch "${NAME}.scss"

fi

# 上一次所在目录，可来回切换
cd -

exit 0
