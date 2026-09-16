<?php
/**
 * Mailer API ndogo ya PHPMailer — WEKA FAILI HII KWENYE HOSTING YA mcadventist.org
 * (mfano: public_html/mail/send.php).
 *
 * Mahitaji kwenye hosting:
 *   1. PHPMailer — pakua kutoka https://github.com/PHPMailer/PHPMailer (folder ya src/)
 *      au endesha `composer require phpmailer/phpmailer` kwenye hosting.
 *   2. Weka PHPMailer kwenye public_html/mail/PHPMailer/ (au badilisha require ndani ya function).
 *   3. Badilisha $SECRET_KEY hapo chini na siri ndefu — lazima ifanane na MAILER_SECRET ya .env ya Node.
 *
 * Node itaita hivi:
 *   POST https://mcadventist.org/mail/send.php
 *   Body (JSON): { "to": "...", "subject": "...", "body": "...", "key": "SECRET" }
 */

header('Content-Type: application/json');

// ⚠️ BADILISHA hii na siri ndefu (herufi 32+) — lazima ifanane na MAILER_SECRET kwenye Node .env
$SECRET_KEY = 'change-this-secret';

// Tuma kutoka kwa mailbox hii ya cPanel
$FROM_EMAIL = 'session@mcadventist.org';
$FROM_NAME  = 'ElimuBora';

// SMTP ya hosting — 587 = STARTTLS
$SMTP_HOST = 'mail.mcadventist.org';
$SMTP_PORT = 587;             // 587 = STARTTLS, 465 = SSL
$SMTP_USER = 'session@mcadventist.org';
$SMTP_PASS = 'Session2025';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !hash_equals($SECRET_KEY, (string)($input['key'] ?? ''))) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'Haujaruhusiwa.']);
    exit;
}

$to      = filter_var($input['to'] ?? '', FILTER_VALIDATE_EMAIL);
$subject = trim((string)($input['subject'] ?? ''));
$body    = trim((string)($input['body'] ?? ''));

if (!$to || $subject === '' || $body === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Taarifa hazikamiliki.']);
    exit;
}

require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require __DIR__ . '/PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = $SMTP_USER;
    $mail->Password   = $SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // port 587
    $mail->Port       = $SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($FROM_EMAIL, $FROM_NAME);
    $mail->addAddress($to);
    $mail->Subject = $subject;
    $mail->Body    = $body;
    $mail->isHTML(false);

    $mail->send();
    echo json_encode(['ok' => true, 'message' => 'Barua pepe imetumwa.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => "Imeshindikana kutuma: {$mail->ErrorInfo}"]);
}
