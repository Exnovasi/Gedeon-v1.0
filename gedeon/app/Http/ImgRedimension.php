<?php
namespace Gedeon\Http;

use Illuminate\Support\Facades\Facade;

class ImgRedimension extends Facade
{
	public static function newImg($img){
		$tmp = $img['tmp_name'];
		if($img['type'] == 'image/jpeg'){
			$origy = imagecreatefromjpeg($tmp);
			$name = 'img_'.rand(0,9).'_user_'.rand(0,9999999999999).".jpg";
		}
		else{ 
			if($img['type'] == 'image/png'){
				$origy = imagecreatefrompng($tmp);
				$name = 'img_'.rand(0,9).'_user_'.rand(0,9999999999999).".png";
			}
			else{
				if($img['type'] == 'image/gif'){
					$origy = imagecreatefromgif($tmp);
					$name = 'img_'.rand(0,9).'_user_'.rand(0,9999999999999).".gif";
				}
				else{
					return 'error';
				}
			}
		}
		$ancho_original = imagesx($origy);
		$alto_original = imagesy($origy);
		$ancho_nuevo = 500;
		$alto_nuevo = round($ancho_nuevo * $alto_original / $ancho_original);
		$copy = imagecreatetruecolor($ancho_nuevo, $alto_nuevo);
		imagecopyresampled($copy, $origy, 0, 0, 0, 0, $ancho_nuevo, $alto_nuevo, $ancho_original, $alto_original);
		if($img['type'] == 'image/jpeg'){
			imagejpeg($copy, "img/user/".$name, 100);
		}
		else{ 
			if($img['type'] == 'image/png'){
				imagepng($copy, "img/user/".$name, 9);
			}
			else{
				if($img['type'] == 'image/gif'){
					imagegif($copy, "img/user/".$name);
				}
				else{
					return 'error';
				}
			}
		}
		return $name;
	}
}
?>