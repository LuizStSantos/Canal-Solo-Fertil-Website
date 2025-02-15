<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Inclua o autoload do Composer (assegure-se de ter executado "composer require phpmailer/phpmailer")
require 'vendor/autoload.php';
require __DIR__ . '/../Config/config.php';  // Configurações movidas para fora da raiz pública
$config = include __DIR__ . '/../Config/config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    if ($data === null) {
        echo json_encode(["success" => false, "mensagem" => "Dados inválidos."]);
        exit;
    }

    $nome = htmlspecialchars($data['nome'] ?? '');
    $email = htmlspecialchars($data['email'] ?? '');
    $mensagem = htmlspecialchars($data['mensagem'] ?? '');

    $mail = new PHPMailer(true);
    try {
        // Configuração SMTP usando variáveis do arquivo de config
        $mail->isSMTP();
        $mail->Host       = $config['smtp']['host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['smtp']['username'];
        $mail->Password   = $config['smtp']['password'];
        $mail->SMTPSecure = $config['smtp']['encryption'];
        $mail->Port       = $config['smtp']['port'];

        // Defina remetente e destinatário
        $mail->setFrom($email, $nome);
        $mail->addAddress('canalsolofertil@gmail.com');

        // Conteúdo do email
        $mail->isHTML(false);
        $mail->Subject = "Nova mensagem de contato de $nome";
        $mail->Body    = "Nome: $nome\nEmail: $email\n\nMensagem:\n$mensagem";

        $mail->send();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode([
            "success" => false, 
            "mensagem" => "Falha ao enviar a mensagem. Mailer Error: {$mail->ErrorInfo}"
        ]);
    }
} else {
    echo json_encode(["success" => false, "mensagem" => "Método de requisição inválido."]);
}
?>
