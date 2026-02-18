/**
 * Document requirements for various E-seva services
 */
const ESEVA_REQUIREMENTS = {
    Birth_Certificate: [
        "hospital_birth_report",
        "parents_aadhar_card",
        "address_proof",
        // Optional: parents_marriage_certificate, affidavit
    ],
    Death_Certificate: [
        "hospital_death_report",
        "deceased_aadhar_card",
        "applicant_aadhar_card",
        "address_proof",
    ],
    Income_Certificate: [
        "aadhar_card",
        "address_proof",
        "ration_card",
        "income_proof",
        "self_declaration",
    ],
    Caste_Certificate: [
        "aadhar_card",
        "address_proof",
        "caste_proof_relative",
        "school_leaving_certificate",
        "affidavit",
    ],
    Domicile_Certificate: [
        "aadhar_card",
        "address_proof",
        "ration_card",
        "self_declaration",
    ],
    Marriage_Certificate: [
        "bride_aadhar_card",
        "groom_aadhar_card",
        "wedding_invitation",
        "marriage_photo",
        "witness_aadhar_1",
        "witness_aadhar_2",
        "address_proof",
    ],
    Senior_Citizen_Certificate: [
        "aadhar_card",
        "age_proof",
        "address_proof",
        "passport_photo",
    ],
    Disability_Certificate: [
        "aadhar_card",
        "medical_report",
        "passport_photo",
        "address_proof",
    ],
};

module.exports = ESEVA_REQUIREMENTS;
