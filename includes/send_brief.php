<?php 

$dev = false;

$pdf = $_POST['pdf'];

$jobstr = $_POST['jobid'];

//GET form data
$form_data = $_POST['formdata'];
parse_str($form_data);

if($dev){

	$adminEmail = "frazer.cameron@nzme.co.nz";

}else{

	$adminEmail = "Aaran.Casey@nzme.co.nz";
}

$pathToPdf = "http://radionetworkcreative.co.nz/DC/dc-web-packages/pdf_export/";

// Email to admin

$mailcheck = spamcheck($email);

	if($mailcheck == FALSE){

		echo json_encode(array("status"=> "invalid", "hint"=>"invalid email"));
		
	}else{

	$subject_em1 = "brief " . $jobstr . " has been submitted";
	$recipient_em1 = $adminEmail;

	//create a boundary for the email.
	$boundary = uniqid('np');

	$headers_em1 = "MIME-Version: 1.0\r\n";
	$headers_em1 .= "From: ".$email." \r\n";
	$headers_em1 .= "To: ".$recipient_em1."\r\n";
	$headers_em1 .= "Content-Type: multipart/alternative;boundary=" . $boundary . "\r\n";

	$message_em1 = "This is a MIME encoded message.";
	//txt email
	$message_em1 .= "\r\n\r\n--" . $boundary . "\r\n";
	$message_em1 .= "Content-type: text/plain;charset=utf-8\r\n\r\n";

	$message_em1 .= 'Account manager: ' .$fname. "\n\n";
	$message_em1 .= 'Phone: '.$phone."\n\n";
	$message_em1 .= $email."\n\n";
	$message_em1 .= $pathToPdf . $pdf . "\n\n";
	$message_em1 .= 'Client: '.$client."\n\n";
	$message_em1 .= 'Deadline: '.$deadline."\n\n";
	$message_em1 .= 'Current website: http://' . $website . "
Brief description\n";
	$message_em1 .= $brief;

	//HTMl email
	$message_em1 .= "\r\n\r\n--" . $boundary . "\r\n";
	$message_em1 .= "Content-type: text/html;charset=utf-8\r\n\r\n";

	$message_em1 .= '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>A new DC job in</title>
	<style type="text/css">
	
	body{
		background-color:#FFFFFF;
	}
	
	</style>
	</head>

	<body style="background-color:#FFF;margin:0px;padding:0px">
	
	<!-- / MAIN WRAPPER \ -->
	<table width="96%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" bordercolor="white" style="background-color:#FFF">
		
		<tr>
		
			<td align="center">

				<table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="background-color:#FFF">

					<tr>
						<td bgcolor="#fff" style="text-align:left;padding:10px;font-family: Arial, sans-serif;font-size:18px;color:#666;background-color:#FFF">

<strong style="font-weight:bold">A new DC job is in</strong><br><br>
<strong style="font-weight:bold">Here is the brief:</strong><br>
Account manager: ' .$fname. '<br>
Phone: '.$phone.'<br>
<a href="mailto:'.$email.'" target="_blank">email</a><br><br>
<a href="' . $pathToPdf . $pdf . '" target="_blank">Quote here</a><br><br>
Client: '.$client.'<br>
Deadline: '.$deadline.'<br>
Current website:<a href="http://' . $website . '"target="_blank">' . $website . '</a><br><br>
<strong style="font-weight:bold">Brief description</strong><br>
'.$brief.'

						<!----></td>
					</tr>

				</table>

			<!----></td>

		</tr>

	</table>

	</body>';

	$message_em1 .= "\r\n\r\n--" . $boundary . "--";

	$body_em1 = $message_em1;

	$mailSent_em1 = mail('', $subject_em1, $body_em1, $headers_em1);

	if($mailSent_em1){
			
		// EMAIL 2

		$subject_em2 = "Thank you " . $fname . " for your brief (".$jobstr.") submission";
		$recipient_em2 = $email;

		//create a boundary for the email.
		//$boundary = uniqid('np');

		$headers_em2 = "MIME-Version: 1.0\r\n";
		$headers_em2 .= "From: ".$adminEmail." \r\n";
		$headers_em2 .= "To: ".$recipient_em2."\r\n";
		$headers_em2 .= "Content-Type: multipart/alternative;boundary=" . $boundary . "\r\n";

		$message_em2 = "This is a MIME encoded message.";
		//txt email
		$message_em2 .= "\r\n\r\n--" . $boundary . "\r\n";
		$message_em2 .= "Content-type: text/plain;charset=utf-8\r\n\r\n";

		$message_em2.= "Thank you " . $fname . " for your brief submission\n";

		$message_em2 .= "Go to this url to download your quote " . $pathToPdf . $pdf . "\n\n";
		
		$message_em2 .= "Please reply to this email with any additional information or assets in relation to this brief.\n\n";
		$message_em2 .= "Below are the details you submited please double check if they are correct\n\n";
		
		$message_em2 .= 'Account manager: ' .$fname. "\n\n";
		$message_em2 .= 'Phone: '.$phone."\n\n";
		$message_em2 .= $email."\n\n";
		$message_em2 .= $pathToPdf . $pdf . "\n\n";
		$message_em2 .= 'Client: '.$client."\n\n";
		$message_em2 .= 'Deadline: '.$deadline."\n\n";
		$message_em2 .= 'Current website: http://' . $website . "
	Brief description\n";
		$message_em2 .= $brief;

		//HTMl email
		$message_em2 .= "\r\n\r\n--" . $boundary . "\r\n";
		$message_em2 .= "Content-type: text/html;charset=utf-8\r\n\r\n";

		$message_em2 .= '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml">
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>A new DC job in</title>
		<style type="text/css">
		
		body{
			background-color:#FFFFFF;
		}
		
		</style>
		</head>

		<body style="background-color:#FFF;margin:0px;padding:0px">
		
		<!-- / MAIN WRAPPER \ -->
		<table width="96%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" bordercolor="white" style="background-color:#FFF">
			
			<tr>
			
				<td align="center">

					<table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="background-color:#FFF">

						<tr>
							<td bgcolor="#fff" style="text-align:left;padding:10px;font-family: Arial, sans-serif;font-size:18px;color:#666;background-color:#FFF">

	<strong style="font-weight:bold">Thank you ' . $fname . ' for your brief submission</strong><br><br>
	<a href="' . $pathToPdf . $pdf . '" target="_blank">Download the quote</a><br><br>

	<strong style="font-weight:bold">Here is the brief you submitted:</strong><br>
	Please reply to this email with any additional information or assets in relation to this brief.<br><br>
	Please double check the below details are correct.<br><br>
	Account manager: ' .$fname. '<br>
	Phone: '.$phone.'<br>
	<a href="mailto:'.$email.'" target="_blank">email</a><br><br>
	Client: '.$client.'<br>
	Deadline: '.$deadline.'<br>
	Current website:<a href="http://' . $website . '"target="_blank">' . $website . '</a><br><br>
	<strong style="font-weight:bold">Brief description</strong><br>
	'.$brief.'

							<!----></td>
						</tr>

					</table>

				<!----></td>

			</tr>

		</table>

		</body>';

		$message_em2 .= "\r\n\r\n--" . $boundary . "--";

		$body_em2 = $message_em2;

		$mailSent_em2 = mail('', $subject_em2, $body_em2, $headers_em2);

		if($mailSent_em2){
				
			die(json_encode(array("status"=>"success")));
		
			
		}else{
			
			die(json_encode(array("status"=>"error sending email2")));
			
		}

		// --
		
	}else{
		
		die(json_encode(array("status"=>"error sending email1")));
		
	}

}

// --------------------------------- SPAM CHECK FUNC

function spamcheck($field){
	
	//filter_var() sanitizes the e-mail
	//address using FILTER_SANITIZE_EMAIL
	$field=filter_var($field, FILTER_SANITIZE_EMAIL);

	//filter_var() validates the e-mail
	//address using FILTER_VALIDATE_EMAIL
	if(filter_var($field, FILTER_VALIDATE_EMAIL)){
	  
		return TRUE;
		
	}else{
		
		return FALSE;
		
	}
	
}



?>