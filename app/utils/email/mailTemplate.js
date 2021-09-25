/**
 *
 * @param application {{header, title, content, link, button_text, extra}}
 * @returns {string}
 */

const {germanTimeFormat, germanDateFormat} = require('../../utils');
module.exports = (application, adminName) => {

    const result = application.status === 2 ? 'Positiv / Positive' : 'Negativ / Negative';
    const resultClass = application.status === 2 ? 'positive-box' : 'negative-box';
    const gender = application.gender === 'male' ? 'Männlich / male' : application.gender === 'female' ? 'Weiblich / female' : 'Divers / diverse';

    return `
<style>
    @import url('https://fonts.googleapis.com/css?family=Poppins:400,600,700,800');

    .mail-container {
        margin: 0 auto;
        padding-top: 50px;
        width: 100%;
        max-width: 720px;
    }
    .mail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .paragraph {
        padding: 16px 0;
    }
    .font-bold: {
        font-weight: bold;
    }
    .w-50 {
        width: 50%;
    }
    .form-line {
        /*display: flex;*/
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-gap: 40px;
    }
    .positive-box {
        border: 3px solid #fe4e60;
        border-radius: 4px;
        color: #fe4e60;
        padding: 15px;
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .negative-box {
        border: 3px solid #1e7e34;
        border-radius: 4px;
        color: #1e7e34;
        padding: 15px;
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .text-center {
        text-align: center;
    }
    .mail-content {
        padding-bottom: 20px;
        font-size: 20px;
    }
    .link-button {
        background-color: #4473c5;
        border-radius: 8px;
        width: 50%;
        padding: 10px 0;
        color: #f1f1f1
    }
    .link {
        display: flex;
        justify-content: center;
    }
    a {
        text-decoration: none;
    }
    .mail-footer {
        background-color: #c5c5c5;
        padding: 10px;
        margin-top: 40px;
        color: #555555;
        text-align: left;
    }
    .mail-value {
        font-size: 40px;
        color: #009EC0;
    }
    .paragraph {
        padding: 12px 0;
    }
    p {
        font-size: 12px;
    }

</style>
<body style="font-family: Poppins, sans-serif; background-color: #e8e5ea;">
<div class="mail-container">
    <div class='mail-header'>
        <p>Abraz Dream GmbH, Boxberger Str. 3, D-12681 Berlin</p>
        <p>${germanDateFormat(application.updatedDate)}</p>
    </div>
    <div class='paragraph'>
        <p class='font-bold'>
            Bescheinigung über das Vorliegen eines positiven oder negativen Antigentests zum Nachweis des SARS-CoV-2 Virus
        </p>
    </div>
    <div class='form-line'>
        <p class=''>Name / Name : </p>
        <p>${application.firstName} ${application.lastName}</p>
    </div>
    <div class='form-line'>
        <p>Geschlecht / Gender: </p>
        <p>${gender}</p>
    </div>
    <div class='form-line'>
        <p>Geburtsdatum / Date of Birth: </p>
        <p>${germanDateFormat(application.birthDay)}</p>
    </div>
    <div class='form-line'>
        <p>Ausweisnummer / ID Number: </p>
        <p>${application.IDNumber}</p>
    </div>
     <div class='form-line'>
        <p>Anschrift / Address: </p>
        <p>${application.address}, ${application.zipcode} ${application.street}</p>
    </div>
    <div class='form-line'>
        <p>Testort / Test Location: </p>
        <p>${application.testCenter && application.testCenter.name} ${application.testCenter && application.testCenter.address}</p>
    </div>
    <div class='form-line'>
        <p>Test-/Probentyp / Test Type:</p>
        <p>SARS-CoV-2 Ag Test | oro-/nasopharyngeal(er) Abstrich / swab </p>
    </div>
    <div class='form-line'>
        <p>Hersteller / Producer: </p>
        <p>Nal von Minden</p>
    </div>
    <div class='form-line'>
        <p>Testname / Test name: </p>
        <p>NADAL COVID-19 AG Test</p>
    </div>
    <div class='form-line'>
        <p>Bestellnummer / Order No: </p>
        <p>${application.id}</p>
    </div>
    <div class='form-line'>
        <p>Testzeitpunkt / Test time: </p>
        <p>${application.checkinDate ? germanTimeFormat(application.checkinDate) : ''}</p>
    </div>
    
    <div class='paragraph'>
        <p>Testergebnis / Test Result:</p>
        <p class=${resultClass}>
            ${result}
        </p>
    </div>
    <p>SARS-CoV-2 Antigen Test (Lateral Flow Method)</p>
    <div class="text-center">
        <div class='paragraph'>
            <p>Wer dieses Dokument fälscht oder einen nicht erfolgten Test unrichtig bescheinigt, macht sich nach § 267 StGB der Urkundenfälschung strafbar. Jeder festgestellte Verstoß wird zur Anzeige gebracht. Wer ein gefälschtes Dokument verwendet, um Zugang zu einer Einrichtung oder einem Angebot zu erhalten, begeht nach der Coronaschutzverordnung des Landes eine Ordnungswidrigkeit, die mit einer Geldbuße in Höhe von 1000€ geahndet wird. </p>
        </div>
        <p>----------------------------------------------------------------------------------------------</p>
        <p>*Bei einem positiven Ergebnis muss sich die Personen unmittelbar in Quarantäne begeben. Dies gilt auch für Haushaltsangehörige von Personen mit einem positiven Schnelltest. Die Quarantäne darf erst beendet werden, wenn ein nachfolgender PCR-Test ein negatives Ergebnis hat. Die positiv getestete Person hat zur Bestätigung oder auch Widerlegung Anspruch auf einen PCR-Test.</p>
        <p><span class='font-bold'>EMPFEHLUNG:</span> Um das Risiko einer Infektion so gering wie möglich zu halten, empfehlen wir Ihnen sich weiterhin an die Vorgaben der Bundeszentrale für gesundheitliche Aufklärung (BZgA): https://www.infektionsschutz.de/ zu halten.</p>
        <p><span class='font-bold'>RECOMMENDATIONs:</span> In order to keep the risk of infection as low as possible, we recommend that you continue to follow the requirements of the Federal Center for Health Education(BZgA): https://www.infektionsschutz.de/. </p>
        <div class='paragraph'>
            <p class='font-bold'>${application.testCenter && application.testCenter.name}</p>
            <p>${application.testCenter && application.testCenter.address}</p>
            <p>${adminName || 'Mohmd Alkhalawi'}</p>
        </div>
    </div>
    <div>
        <img src="" alt="">
    </div>
    
</div>
</body>
	`;
};
