$( document ).ready(function() {
$(".iWishView").click(function() {
	if($(this).attr('data-customer-id')==0)
	{
		if(typeof(Storage) !== "undefined") {
			 sessionStorage.iWishRedirect='view';
			 document.location.href='/account/login/';
		}
	} else {
		iWishPost('/apps/iwish',{cust: iwish_cid});
		return false;
	}
});
$( ".iWishAdd" ).click(function() {
	var iWishvId = $(this).parents('form').find("[name='id']").val();
	if($(this).attr('data-customer-id')==0) 
	{
		if(typeof(Storage) !== "undefined") {
			sessionStorage.iWishRedirect='post';
			sessionStorage.iWishProduct=$(this).attr('data-product');
			sessionStorage.iWishVarient=iWishvId;
			document.location.href='/account/login';
		}
		return false;
	} else {
		iWishPost('/apps/iwish',{ cust: $(this).attr('data-customer-id'),pid:$(this).attr('data-product'),vid:iWishvId });
		return false;
	}
});
});
