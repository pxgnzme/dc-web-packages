<?php 

require('fpdf.php');

class PDF extends FPDF
{
	var $B;
	var $I;
	var $U;
	var $HREF;

	function PDF($orientation='P', $unit='mm', $size='A4')
	{
		// Call parent constructor
		$this->FPDF($orientation,$unit,$size);
		// Initialization
		$this->B = 0;
		$this->I = 0;
		$this->U = 0;
		$this->HREF = '';
	}

	function WriteHTML($html)
	{
		// HTML parser
		$html = str_replace("\n",' ',$html);
		$a = preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
		foreach($a as $i=>$e)
		{
			if($i%2==0)
			{
				// Text
				if($this->HREF)
					$this->PutLink($this->HREF,$e);
				else
					$this->Write(5,$e);
			}
			else
			{
				// Tag
				if($e[0]=='/')
					$this->CloseTag(strtoupper(substr($e,1)));
				else
				{
					// Extract attributes
					$a2 = explode(' ',$e);
					$tag = strtoupper(array_shift($a2));
					$attr = array();
					foreach($a2 as $v)
					{
						if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
							$attr[strtoupper($a3[1])] = $a3[2];
					}
					$this->OpenTag($tag,$attr);
				}
			}
		}
	}

	function OpenTag($tag, $attr)
	{
		// Opening tag
		if($tag=='B' || $tag=='I' || $tag=='U')
			$this->SetStyle($tag,true);
		if($tag=='A')
			$this->HREF = $attr['HREF'];
		if($tag=='BR')
			$this->Ln(5);
	}

	function CloseTag($tag)
	{
		// Closing tag
		if($tag=='B' || $tag=='I' || $tag=='U')
			$this->SetStyle($tag,false);
		if($tag=='A')
			$this->HREF = '';
	}

	function SetStyle($tag, $enable)
	{
		// Modify style and select corresponding font
		$this->$tag += ($enable ? 1 : -1);
		$style = '';
		foreach(array('B', 'I', 'U') as $s)
		{
			if($this->$s>0)
				$style .= $s;
		}
		$this->SetFont('',$style);
	}

	function PutLink($URL, $txt)
	{
		// Put a hyperlink
		$this->SetTextColor(0,0,255);
		$this->SetStyle('U',true);
		$this->Write(5,$txt,$URL);
		$this->SetStyle('U',false);
		$this->SetTextColor(0);
	}
}

$html = 'You can now easily print text mixing different styles: <b>bold</b>, <i>italic</i>,
<u>underlined</u>, or <b><i><u>all at once</u></i></b>!<br><br>You can also insert links on
text, such as <a href="http://www.fpdf.org">www.fpdf.org</a>, or on an image: click on the logo.';

$pdf = new FPDF('P','mm','A4');

$pdf -> SetAuthor('Digital Creative');
$pdf -> SetTitle('DC website estimate');
//$pdf -> SetFont('Helvetica','B',20);
$pdf -> SetFont('Arial','',20);
$pdf -> SetTextColor(51,51,51);

$pdf -> AddPage('P');
$pdf -> SetDisplayMode(real,'default');

//$pdf -> Image('logo.png',10,20,400,0,' ','http://nzme.co.nz');

$pdf -> Image('header_image.png',10,6,190);

$pdf -> SetX(50);
$pdf -> SetDrawColor(50,60,100);

$pdf -> SetXY(10,35);
$pdf -> SetFontSize(10);

//$pdf -> WriteHTML($html);
//$pdf -> write(5,'You generated a DC web estimate. ');

$pdf -> Output('dc_web_estimate.pdf','I');


?>