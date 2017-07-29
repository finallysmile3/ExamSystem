

function checkPhone(phone)
{
	var match = /^(13[0-9]|15[0-9]|18[0-9]|177)\d{8}$/;
	if(!match.exec(phone))
	{
		alert("请输入正确的手机号码");
		return false;
	}
	return true;
}