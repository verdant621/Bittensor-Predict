import _0x1db672 from "dotenv";
import _0x17973d from "os";
import _0x47f17c from "path";
import _0x1dff80 from "puppeteer-extra";
import _0x5b304a from "puppeteer-extra-plugin-stealth";
import { click } from "puppeteer-utilz";
import { getRemainedEmail, saveAccount } from "./firebase/firebase.js";
import {
  generateAddress,
  generateEmail,
  getEmailVeryfyLink,
  getVerifyLink,
} from "./mailbox.js";
import { readFileAsync, wait, evaluate } from "./utils.js";
export const GQL_URL = "https://ww" + "w.upwork.c" + "om/api/gra" + "phql/v1";
export const ORDER = [
  "CREATE-PRO" + "FILE/EXPER" + "IENCE",
  "CREATE-PRO" + "FILE/GOAL",
  "CREATE-PRO" + "FILE/WORK-" + "PREFERENCE" + "-1",
  "CREATE-PRO" + "FILE/WORK-" + "PREFERENCE" + "-2",
  "CREATE-PRO" + "FILE/TITLE",
  "CREATE-PRO" + "FILE/EMPLO" + "YMENT",
  "CREATE-PRO" + "FILE/EDUCA" + "TION",
  "CREATE-PRO" + "FILE/LANGU" + "AGES",
  "CREATE-PRO" + "FILE/SKILL" + "S",
  "CREATE-PRO" + "FILE/OVERV" + "IEW",
  "CREATE-PRO" + "FILE/CATEG" + "ORIES",
  "CREATE-PRO" + "FILE/RATE",
  "CREATE-PRO" + "FILE/BIRTH" + "DAY",
  "CREATE-PRO" + "FILE/ADDR&" + "PHONE",
  "COMPLETE-O" + "NBOARDING",
  "REVIEW",
  "NOTIFICATI" + "ON",
];
export function generateGQLHeader(_0x20c1dd) {
  const _0x4805bd = {
    xUGsC: "*/*",
    Uvkqe: "gzip,\x20defl" + "ate,\x20br",
    SrDAJ: "en-US,en;q" + "=0.9",
    Iyldw: "applicatio" + "n/json",
    garEy: "cors",
    jttiG: "same-origi" + "n",
    eWRNr:
      "Mozilla/5." +
      "0\x20(Windows" +
      "\x20NT\x2010.0;\x20" +
      "Win64;\x20x64" +
      ")\x20AppleWeb" +
      "Kit/537.36" +
      "\x20(KHTML,\x20l" +
      "ike\x20Gecko)" +
      "\x20Chrome/11" +
      "8.0.0.0\x20Sa" +
      "fari/537.3" +
      "6",
    CmNjh: "en-US",
  };
  return {
    Accept: _0x4805bd["xUGsC"],
    "Accept-Encoding": _0x4805bd["Uvkqe"],
    "Accept-Language": _0x4805bd["SrDAJ"],
    Authorization: "bearer\x20" + _0x20c1dd,
    "Content-Type": _0x4805bd["Iyldw"],
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": _0x4805bd["garEy"],
    "Sec-Fetch-Site": _0x4805bd["jttiG"],
    "User-Agent": _0x4805bd["eWRNr"],
    "X-Upwork-Accept-Language": _0x4805bd["CmNjh"],
  };
}
export function generateAPIHeader(_0x49daa6, _0x4448c7) {
  const _0x163e5e = {
    KPuxP: "applicatio" + "n/json,\x20te" + "xt/plain,\x20" + "*/*",
    GNuVw: "gzip,\x20defl" + "ate,\x20br",
    gRcEE: "en-US,en;q" + "=0.9",
    qmACW: "cors",
    aKFbz: "same-origi" + "n",
    RuUUT:
      "Mozilla/5." +
      "0\x20(Windows" +
      "\x20NT\x2010.0;\x20" +
      "Win64;\x20x64" +
      ")\x20AppleWeb" +
      "Kit/537.36" +
      "\x20(KHTML,\x20l" +
      "ike\x20Gecko)" +
      "\x20Chrome/11" +
      "8.0.0.0\x20Sa" +
      "fari/537.3" +
      "6",
    sllGI: "en-US",
  };
  return {
    Accept: _0x163e5e["KPuxP"],
    "Accept-Encoding": _0x163e5e["GNuVw"],
    "Accept-Language": _0x163e5e["gRcEE"],
    Authorization: "bearer\x20" + _0x49daa6,
    "Content-Type": "applicatio" + "n/json",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": _0x163e5e["qmACW"],
    "Sec-Fetch-Site": _0x163e5e["aKFbz"],
    "User-Agent": _0x163e5e["RuUUT"],
    "x-odesk-csrf-token": "" + _0x4448c7,
    "x-odesk-user-agent": "oDesk\x20LM",
    "x-requested-with": "XMLHttpReq" + "uest",
    "X-Upwork-Accept-Language": _0x163e5e["sllGI"],
  };
}
export function generateBody(_0x381d34, _0x447c0f) {
  const _0x386813 = {
    LtibB: "CREATE-PRO" + "FILE/EXPER" + "IENCE",
    vOdHH:
      "\x0amutation\x20" +
      "updateTale" +
      "ntQuestion" +
      "Choices($i" +
      "nput:\x20Upda" +
      "teTalentQu" +
      "estionChoi" +
      "cesInput)\x20" +
      "{\x0a\x20\x20update" +
      "TalentQues" +
      "tionChoice" +
      "s(input:\x20$" +
      "input)\x20{\x0a\x20" +
      "\x20\x20\x20\x20\x20statu" +
      "s\x0a\x20\x20\x20\x20}\x0a}",
    rMioG: "EXPERIENCE",
    BJDiw: "FREELANCED" + "_BEFORE",
    bCPiZ: "FREELANCE_" + "GOAL",
    KNZPZ: "GET_EXPERI" + "ENCE",
    UDVSs: "CREATE-PRO" + "FILE/WORK-" + "PREFERENCE" + "-1",
    NcDhD: "DELIVERY_M" + "ODEL",
    WsqXb: function (_0x34f484, _0x2775a1) {
      return _0x34f484 === _0x2775a1;
    },
    ftyAm: "START-PROF" + "ILE-PROCES" + "S",
    GmcBN: "CREATE-PRO" + "FILE/TITLE",
    bqXEK:
      "mutation\x20u" +
      "pdateTalen" +
      "tProfileTi" +
      "tle($input" +
      ":\x20TalentPr" +
      "ofileTitle" +
      "Input!){\x20\x0a" +
      "\x20\x20\x20\x20update" +
      "TalentProf" +
      "ileTitle(i" +
      "nput:\x20$inp" +
      "ut){\x20\x20\x20\x20\x20\x20" +
      "\x0a\x20\x20\x20\x20\x20\x20sta" +
      "tus\x0a\x20\x20\x20\x20}}",
    FIBjO: "CREATE-PRO" + "FILE/EMPLO" + "YMENT",
    niPQW: "HKG",
    NBIhO:
      "mutation\x20u" +
      "pdateTalen" +
      "tEmploymen" +
      "tRecords($" +
      "records:\x20[" +
      "TalentEmpl" +
      "oymentReco" +
      "rdInput!])" +
      "{\x20\x0a\x20\x20updat" +
      "eTalentEmp" +
      "loymentRec" +
      "ords(\x20reco" +
      "rds:\x20$reco" +
      "rds\x20){\x0a\x20\x20\x20" +
      "\x20\x20id\x0a\x20\x20}}",
    dZBKJ: function (_0x3eec7c, _0x43d589) {
      return _0x3eec7c === _0x43d589;
    },
    DTzvT: "CREATE-PRO" + "FILE/EDUCA" + "TION",
    lZeTt: "CREATE-PRO" + "FILE/LANGU" + "AGES",
    enocX:
      "mutation\x20u" +
      "pdateTalen" +
      "tLanguageR" +
      "ecords($re" +
      "cords:\x20[Ta" +
      "lentLangua" +
      "geInput!])" +
      "{\x20\x0a\x20\x20updat" +
      "eTalentLan" +
      "guageRecor" +
      "ds(records" +
      ":\x20$records" +
      "){\x0a\x20\x20\x20\x20id\x0a" +
      "\x20\x20}}",
    Fjlqt: "English",
    xrsxy: "flul",
    otmio: function (_0x30687b, _0x16ba75) {
      return _0x30687b === _0x16ba75;
    },
    AZrcn: "CREATE-PRO" + "FILE/SKILL" + "S",
    tlTHq:
      "mutation\x20u" +
      "pdateTalen" +
      "tProfileSk" +
      "ills($inpu" +
      "t:\x20TalentP" +
      "rofileSkil" +
      "lsInput!){" +
      "\x20\x0a\x20\x20update" +
      "TalentProf" +
      "ileSkills(" +
      "input:\x20$in" +
      "put){\x0a\x20\x20\x20\x20" +
      "status\x0a\x20\x20}" +
      "}",
    FOyyE: "CREATE-PRO" + "FILE/OVERV" + "IEW",
    bowwH:
      "mutation\x20u" +
      "pdateTalen" +
      "tProfileDe" +
      "scription(" +
      "$input:\x20Ta" +
      "lentProfil" +
      "eDescripti" +
      "onInput!){" +
      "\x20\x0a\x20\x20update" +
      "TalentProf" +
      "ileDescrip" +
      "tion(input" +
      ":\x20$input){" +
      "\x0a\x20\x20\x20\x20statu" +
      "s\x0a\x20\x20}}",
    DKZnk: function (_0x1bd885, _0x18811f) {
      return _0x1bd885 === _0x18811f;
    },
    ujMhC:
      "mutation\x20u" +
      "pdateTalen" +
      "tProfileSu" +
      "bCategorie" +
      "s($input:\x20" +
      "TalentProf" +
      "ileSubCate" +
      "goriesInpu" +
      "t!){\x20\x0a\x20\x20up" +
      "dateTalent" +
      "ProfileSub" +
      "Categories" +
      "(input:\x20$i" +
      "nput){\x0a\x20\x20\x20" +
      "\x20status\x0a\x20\x20" +
      "}}",
    lyxnt: "CREATE-PRO" + "FILE/RATE",
    yszlc:
      "mutation\x20u" +
      "pdateTalen" +
      "tProfileHo" +
      "urlyRate($" +
      "input:\x20Tal" +
      "entProfile" +
      "HourlyRate" +
      "Input!){\x20\x0a" +
      "\x20\x20updateTa" +
      "lentProfil" +
      "eHourlyRat" +
      "e(input:\x20$" +
      "input){\x20\x20\x20" +
      "\x20\x20\x20\x0a\x20\x20\x20\x20st" +
      "atus\x0a\x20\x20}}",
    PaeSB: "USD",
    odUmT: "CREATE-PRO" + "FILE/BIRTH" + "DAY",
    vkBlz: "CREATE-PRO" + "FILE/ADDR&" + "PHONE",
    PoigW: function (_0x8e0618, _0x2b25f6) {
      return _0x8e0618 === _0x2b25f6;
    },
    qqESf: function (_0x32c848, _0x723492) {
      return _0x32c848 === _0x723492;
    },
    NJfUh: "NOTIFICATI" + "ON",
    igAfT: "false",
    HsvFJ: "all",
    pkcIn: "immediate",
    jpRID: "always",
    sEdwd: "mine",
    BtDwv:
      "query\x20onto" +
      "logyElemen" +
      "tsSearchBy" +
      "PrefLabel(" +
      "$filter:\x20O" +
      "ntologyEle" +
      "mentsSearc" +
      "hByPrefLab" +
      "elFilter){" +
      "\x20\x0a\x20\x20ontolo" +
      "gyElements" +
      "SearchByPr" +
      "efLabel(fi" +
      "lter:\x20$fil" +
      "ter){\x0a\x20\x20\x20\x20" +
      "id\x0a\x20\x20\x20\x20ont" +
      "ologyId\x0a\x20\x20" +
      "\x20\x20preferre" +
      "dLabel\x0a\x20\x20\x20" +
      "\x20...\x20\x20on\x20S" +
      "kill\x20{\x0a\x20\x20\x20" +
      "\x20\x20\x20legacyS" +
      "killNid\x0a\x20\x20" +
      "\x20\x20}\x0a\x20\x20}}",
    lBXEn: "SKILL",
    aHtoM: "ACTIVE",
    qbTLP: "match-star" + "t",
    XWghY: function (_0x3f6296, _0x535299) {
      return _0x3f6296 === _0x535299;
    },
    akBeE: "GET-SERVIC" + "E-ID",
    UUNCW:
      "query\x20{\x0a\x20\x20" +
      "ontologyCa" +
      "tegories{\x0a" +
      "\x20\x20\x20\x20id\x0a\x20\x20\x20" +
      "\x20preferred" +
      "Label\x0a\x20\x20\x20\x20" +
      "subcategor" +
      "ies\x20{\x0a\x20\x20\x20\x20" +
      "\x20\x20id\x0a\x20\x20\x20\x20\x20" +
      "\x20preferred" +
      "Label\x0a\x20\x20\x20\x20" +
      "}\x0a}}",
    znRXS: function (_0x22ec16, _0x168734) {
      return _0x22ec16 === _0x168734;
    },
    FPEcb:
      "query\x20getC" +
      "ity($count" +
      "ryCode:\x20St" +
      "ring!,\x20$qu" +
      "ery:\x20Strin" +
      "g!){\x0a\x20\x20cit" +
      "ySearchRec" +
      "ords(filte" +
      "r:{country" +
      "_eq:\x20$coun" +
      "tryCode,\x20q" +
      "uery_eq:\x20$" +
      "query},\x20li" +
      "mit:\x205){\x0a\x20" +
      "\x20\x20\x20city{\x0a\x20" +
      "\x20\x20\x20\x20\x20name," +
      "\x0a\x20\x20\x20\x20\x20\x20sta" +
      "te\x20{\x0a\x20\x20\x20\x20\x20" +
      "\x20\x20\x20code,\x0a\x20" +
      "\x20\x20\x20\x20\x20\x20\x20nam" +
      "e,\x0a\x20\x20\x20\x20\x20\x20\x20" +
      "\x20country\x20{" +
      "\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20" +
      "\x20twoLetter" +
      "Abbreviati" +
      "on\x0a\x20\x20\x20\x20\x20\x20\x20" +
      "\x20}\x0a\x20\x20\x20\x20\x20\x20}" +
      ",\x0a}}}",
    UULcR: "BID",
    FQekN: "FIXED",
    PZvEJ: function (_0x498546, _0x3d9cdc) {
      return _0x498546 === _0x3d9cdc;
    },
    ZsnZC: "HOURLY",
  };
  if (_0x381d34 === _0x386813["LtibB"])
    return {
      query: _0x386813["vOdHH"],
      variables: {
        input: {
          questionId: _0x386813["rMioG"],
          choiceIds: [_0x386813["BJDiw"]],
        },
      },
    };
  else {
    if (_0x381d34 === "CREATE-PRO" + "FILE/GOAL")
      return {
        query: _0x386813["vOdHH"],
        variables: {
          input: {
            questionId: _0x386813["bCPiZ"],
            choiceIds: [_0x386813["KNZPZ"]],
          },
        },
      };
    else {
      if (_0x381d34 === _0x386813["UDVSs"])
        return {
          query: _0x386813["vOdHH"],
          variables: {
            input: {
              questionId: _0x386813["NcDhD"],
              choiceIds: ["MARKETPLAC" + "E"],
            },
          },
        };
      else {
        if (_0x381d34 === "CREATE-PRO" + "FILE/WORK-" + "PREFERENCE" + "-2")
          return {
            query:
              "\x0a\x20\x20\x20\x20mutat" +
              "ion\x20update" +
              "Freelancer" +
              "ContractTo" +
              "Hire($inpu" +
              "t:\x20Freelan" +
              "cerContrac" +
              "tToHireInp" +
              "ut!)\x20{\x0a\x20\x20\x20" +
              "\x20\x20\x20\x20\x20updat" +
              "eFreelance" +
              "rContractT" +
              "oHire(inpu" +
              "t:\x20$input)" +
              "\x20{\x0a\x20\x20\x20\x20\x20\x20\x20" +
              "\x20\x20\x20\x20\x20statu" +
              "s\x0a\x20\x20\x20\x20\x20\x20\x20\x20" +
              "}\x0a\x20\x20\x20\x20}",
            variables: { input: { contractToHire: !![] } },
          };
        else {
          if (_0x386813["WsqXb"](_0x381d34, _0x386813["ftyAm"])) return {};
          else {
            if (_0x386813["WsqXb"](_0x381d34, _0x386813["GmcBN"]))
              return {
                query: _0x386813["bqXEK"],
                variables: { input: { title: "" + _0x447c0f["title"] } },
              };
            else {
              if (_0x381d34 === _0x386813["FIBjO"]) {
                const _0xaa4acb = [];
                for (const _0x3cb781 of _0x447c0f["employment"]) {
                  _0xaa4acb["push"]({
                    companyName: _0x3cb781["company"],
                    jobTitle: _0x3cb781["role"],
                    description: null,
                    city: null,
                    country: _0x386813["niPQW"],
                    startDate: _0x3cb781["start"],
                    endDate: _0x3cb781["end"],
                  });
                }
                return {
                  query: _0x386813["NBIhO"],
                  variables: { records: _0xaa4acb },
                };
              } else {
                if (_0x386813["dZBKJ"](_0x381d34, _0x386813["DTzvT"])) {
                  const _0x5c5f06 = [];
                  for (const _0xdc833a of _0x447c0f["education"]) {
                    _0x5c5f06["push"]({
                      institutionName: _0xdc833a["university"],
                      areaOfStudy: _0xdc833a["field"],
                      degree: _0xdc833a["degree"],
                      dateStarted: _0xdc833a["start"],
                      dateEnded: _0xdc833a["end"],
                    });
                  }
                  return {
                    query:
                      "mutation\x20u" +
                      "pdateTalen" +
                      "tEducation" +
                      "Records($r" +
                      "ecords:\x20[T" +
                      "alentEduca" +
                      "tionRecord" +
                      "Input!]){\x20" +
                      "\x0a\x20updateTa" +
                      "lentEducat" +
                      "ionRecords" +
                      "(\x20records:" +
                      "\x20$records\x20" +
                      "){\x20id\x20}}",
                    variables: { records: _0x5c5f06 },
                  };
                } else {
                  if (_0x381d34 === _0x386813["lZeTt"])
                    return {
                      query: _0x386813["enocX"],
                      variables: {
                        records: [
                          {
                            language: {
                              iso639Code: "en",
                              active: !![],
                              englishName: _0x386813["Fjlqt"],
                            },
                            proficiencyLevel: { code: _0x386813["xrsxy"] },
                          },
                        ],
                      },
                    };
                  else {
                    if (_0x386813["otmio"](_0x381d34, _0x386813["AZrcn"]))
                      return {
                        query: _0x386813["tlTHq"],
                        variables: { input: { skills: _0x447c0f["skills"] } },
                      };
                    else {
                      if (_0x381d34 === _0x386813["FOyyE"])
                        return {
                          query: _0x386813["bowwH"],
                          variables: {
                            input: { description: _0x447c0f["overview"] },
                          },
                        };
                      else {
                        if (
                          _0x386813["DKZnk"](
                            _0x381d34,
                            "CREATE-PRO" + "FILE/CATEG" + "ORIES"
                          )
                        )
                          return {
                            query: _0x386813["ujMhC"],
                            variables: {
                              input: {
                                subCategoryIDs: _0x447c0f["categories"],
                              },
                            },
                          };
                        else {
                          if (_0x386813["WsqXb"](_0x381d34, _0x386813["lyxnt"]))
                            return {
                              query: _0x386813["yszlc"],
                              variables: {
                                input: {
                                  hourlyRate: {
                                    amount: _0x447c0f["rate"],
                                    currency: _0x386813["PaeSB"],
                                  },
                                },
                              },
                            };
                          else {
                            if (
                              _0x386813["otmio"](_0x381d34, _0x386813["odUmT"])
                            )
                              return {
                                query:
                                  "mutation\x20s" +
                                  "aveDateOfB" +
                                  "irth($inpu" +
                                  "t:\x20DateOfB" +
                                  "irthInput!" +
                                  ")\x20{\x0a\x20\x20save" +
                                  "DateOfBirt" +
                                  "h(input:\x20$" +
                                  "input)\x0a}",
                                variables: {
                                  input: { dateOfBirth: _0x447c0f["birthday"] },
                                },
                              };
                            else {
                              if (_0x381d34 === _0x386813["vkBlz"])
                                return {
                                  address: {
                                    street: _0x447c0f["street"],
                                    state: _0x447c0f["state"],
                                    city: _0x447c0f["city"],
                                    zip: _0x447c0f["zip"],
                                    additionalInfo: "",
                                    country: _0x447c0f["country"],
                                    address: null,
                                  },
                                  phoneNumber: _0x447c0f["phone"],
                                  phoneCode: _0x447c0f["phoneCode"],
                                };
                              else {
                                if (
                                  _0x386813["DKZnk"](
                                    _0x381d34,
                                    "COMPLETE-O" + "NBOARDING"
                                  )
                                )
                                  return {
                                    query:
                                      "mutation\x20{" +
                                      "\x0a\x20\x20talentO" +
                                      "nboardingC" +
                                      "omplete\x0a}",
                                    variables: null,
                                  };
                                else {
                                  if (_0x386813["PoigW"](_0x381d34, "REVIEW"))
                                    return {};
                                  else {
                                    if (
                                      _0x386813["qqESf"](
                                        _0x381d34,
                                        _0x386813["NJfUh"]
                                      )
                                    )
                                      return {
                                        desktopCounter: "all",
                                        desktopNotify: "all",
                                        desktopSound: _0x386813["igAfT"],
                                        mobileNotify: _0x386813["HsvFJ"],
                                        mobileCounter: "all",
                                        mobileSound: _0x386813["igAfT"],
                                        dashEmailFreq: _0x386813["pkcIn"],
                                        dashEmailWhen: _0x386813["HsvFJ"],
                                        dashEmailPresence: _0x386813["jpRID"],
                                        allContracts: _0x386813["sEdwd"],
                                        allRecruiting: _0x386813["sEdwd"],
                                        receive_documents_digitally: ![],
                                        dash_desktop_all: !![],
                                        dash_desktop_important: !![],
                                        dash_desktop_never: !![],
                                        dash_desktop_sound: !![],
                                        dash_message_counter_all: !![],
                                        dash_message_counter_important: !![],
                                        dash_email_approximately: !![],
                                        dash_email_all: !![],
                                        dash_email_important: !![],
                                        dash_email_presence: !![],
                                        er_job_posted: !![],
                                        er_japp_submitted: !![],
                                        er_intv_acc: !![],
                                        er_intv_declined: !![],
                                        er_offer_updated: !![],
                                        er_job_will_expire: !![],
                                        er_job_expired: !![],
                                        er_no_intv: !![],
                                        pja_intv_accepted: !![],
                                        pja_offer: !![],
                                        pja_japp_declined: !![],
                                        pja_japp_rejected: !![],
                                        pja_job_change: !![],
                                        pja_japp_withdrawn: !![],
                                        cntr_hire: !![],
                                        cntr_timelog_begins: !![],
                                        cntr_terms: !![],
                                        cntr_end: !![],
                                        cntr_timelog: !![],
                                        cntr_fb_change: !![],
                                        cntr_offline_summary: !![],
                                        cntr_bpa_wk_buyer: !![],
                                        cntr_misc: !![],
                                        cntr_bpa: !![],
                                        grp_mem: !![],
                                        ref_profile: !![],
                                        ref_invite: !![],
                                        cntr_revoke: !![],
                                        subscription_event: !![],
                                        on_board_msg: !![],
                                        misc_local: !![],
                                        who_viewed_job: !![],
                                        connects_expiry: !![],
                                        connects_purchase: !![],
                                        job_recommendations: !![],
                                        marketing_email: ![],
                                        tc: [],
                                      };
                                    else {
                                      if (
                                        _0x386813["dZBKJ"](
                                          _0x381d34,
                                          "GET-SKILL-" + "ID"
                                        )
                                      )
                                        return {
                                          query: _0x386813["BtDwv"],
                                          variables: {
                                            filter: {
                                              preferredLabel_any:
                                                _0x447c0f["skill"],
                                              type: _0x386813["lBXEn"],
                                              entityStatus_eq:
                                                _0x386813["aHtoM"],
                                              sortOrder: _0x386813["qbTLP"],
                                              limit: 0x32,
                                              includeAttributeGroups: ![],
                                            },
                                          },
                                        };
                                      else {
                                        if (
                                          _0x386813["XWghY"](
                                            _0x381d34,
                                            _0x386813["akBeE"]
                                          )
                                        )
                                          return {
                                            query: _0x386813["UUNCW"],
                                            variables: null,
                                          };
                                        else {
                                          if (
                                            _0x386813["znRXS"](
                                              _0x381d34,
                                              "GET-LOCATI" + "ON-DATA"
                                            )
                                          )
                                            return {
                                              query: _0x386813["FPEcb"],
                                              variables: {
                                                query: _0x447c0f["city"],
                                                countryCode:
                                                  _0x447c0f["countryCod" + "e"],
                                              },
                                            };
                                          else {
                                            if (
                                              _0x381d34 === _0x386813["UULcR"]
                                            ) {
                                              const _0x49aaea = {
                                                version: 0x3,
                                                jobReference:
                                                  _0x447c0f[
                                                    "jobReferen" + "ce"
                                                  ],
                                                agency: null,
                                                chargedAmount: 0x32,
                                                coverLetter:
                                                  _0x447c0f["bidMessage"],
                                                earnedAmount: null,
                                                estimatedDuration: null,
                                                occupationUID: null,
                                                portfolioItemUids: [],
                                                attachments: [],
                                                questions: [],
                                                milestones: [],
                                                readyToStartDate: null,
                                                selectedContractor: {
                                                  uid: _0x447c0f["uid"],
                                                  oDeskUserID:
                                                    _0x447c0f[
                                                      "oDeskUserI" + "D"
                                                    ],
                                                },
                                                profileRateToSet: ![],
                                                boostBidAmount: 0x32,
                                                rateGuidance: null,
                                                agencyOrgUid: null,
                                              };
                                              if (
                                                _0x386813["dZBKJ"](
                                                  _0x447c0f["type"],
                                                  _0x386813["FQekN"]
                                                )
                                              )
                                                _0x49aaea[
                                                  "estimatedD" + "uration"
                                                ] =
                                                  _0x447c0f[
                                                    "estimatedD" + "uration"
                                                  ];
                                              else
                                                _0x386813["PZvEJ"](
                                                  _0x447c0f["type"],
                                                  _0x386813["ZsnZC"]
                                                ) &&
                                                  (_0x49aaea["sri"] = {
                                                    percent: 0x0,
                                                    frequency: 0x0,
                                                  });
                                              return _0x49aaea;
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
const stealth = _0x5b304a();
_0x1dff80["use"](_0x5b304a()),
  stealth["enabledEva" + "sions"]["delete"]("iframe.con" + "tentWindow"),
  _0x1db672["config"]();
let AUTH = { token: "", oauth: "" };
function generatePhoneNumber() {
  const _0x16cb1c = {
      ZFXAm: function (_0x4fd80d, _0x40d937) {
        return _0x4fd80d + _0x40d937;
      },
      QZLAu: function (_0x5719be, _0x5ab065) {
        return _0x5719be * _0x5ab065;
      },
    },
    _0x2a6242 = _0x16cb1c["ZFXAm"](
      Math["floor"](
        _0x16cb1c["QZLAu"](
          Math["random"](),
          0x31a8 * 0xd18 + -0x142 * -0x65965 + -0x529564a
        )
      ),
      0x98516 * 0x8 + -0xacfba8 + -0x2 * -0x7cb4bc
    );
  return _0x2a6242["toString"]();
}
async function input(
  _0x5f5520,
  _0x345ddb,
  _0x408803,
  _0x101385 = 0x8f0 * -0x1 + 0xb * 0x17b + -0x759
) {
  await _0x5f5520["waitForSel" + "ector"](_0x345ddb),
    await _0x5f5520["type"](_0x345ddb, _0x408803, { delay: _0x101385 });
}
async function getAuthData(_0x8615d5) {
  const _0x4a9d1b = {
      xujIT: "XSRF-TOKEN",
      dlFFs: "oauth2v2_",
      cYgxQ: "https://ww" + "w.upwork.c" + "om/api/gra" + "phql/v1",
      BWAFx: "*/*",
      NJloB: "gzip,\x20defl" + "ate,\x20br",
      nGrAz: "en-US,en;q" + "=0.9",
      ALlGc: "applicatio" + "n/json",
      yGNbO: "empty",
      ilxDU: "cors",
      QNCPX:
        "Mozilla/5." +
        "0\x20(Windows" +
        "\x20NT\x2010.0;\x20" +
        "Win64;\x20x64" +
        ")\x20AppleWeb" +
        "Kit/537.36" +
        "\x20(KHTML,\x20l" +
        "ike\x20Gecko)" +
        "\x20Chrome/11" +
        "8.0.0.0\x20Sa" +
        "fari/537.3" +
        "6",
      iLbDw:
        "query\x20onto" +
        "logyElemen" +
        "tsSearchBy" +
        "PrefLabel(" +
        "$filter:\x20O" +
        "ntologyEle" +
        "mentsSearc" +
        "hByPrefLab" +
        "elFilter){" +
        "\x20\x0a\x20\x20ontolo" +
        "gyElements" +
        "SearchByPr" +
        "efLabel(fi" +
        "lter:\x20$fil" +
        "ter){\x0a\x20\x20\x20\x20" +
        "id\x0a\x20\x20\x20\x20ont" +
        "ologyId\x0a\x20\x20" +
        "\x20\x20preferre" +
        "dLabel\x0a\x20\x20\x20" +
        "\x20...\x20\x20on\x20S" +
        "kill\x20{\x0a\x20\x20\x20" +
        "\x20\x20\x20legacyS" +
        "killNid\x0a\x20\x20" +
        "\x20\x20}\x0a\x20\x20}}",
      BMVtd: "ACTIVE",
      dLpxf: "match-star" + "t",
      KKpBm: function (_0x5c0e94, _0x5d709f, _0x5e60a8, _0x373ac3, _0x4fc8cc) {
        return _0x5c0e94(_0x5d709f, _0x5e60a8, _0x373ac3, _0x4fc8cc);
      },
    },
    _0x20049b = { token: "", oauth: "" },
    _0x3e916c = [],
    _0x462df7 = await _0x8615d5["cookies"]();
  for (const _0x2ba90f of _0x462df7) {
    if (_0x2ba90f["name"] === _0x4a9d1b["xujIT"])
      _0x20049b["token"] = _0x2ba90f["value"];
    _0x2ba90f["name"]["endsWith"]("sb") &&
      _0x2ba90f["value"]["startsWith"](_0x4a9d1b["dlFFs"]) &&
      _0x3e916c["push"](_0x2ba90f["value"]);
  }
  for (const _0x2ae511 of _0x3e916c) {
    const _0x1f0ad2 = _0x4a9d1b["cYgxQ"],
      _0x54b275 = {
        Accept: _0x4a9d1b["BWAFx"],
        "Accept-Encoding": _0x4a9d1b["NJloB"],
        "Accept-Language": _0x4a9d1b["nGrAz"],
        Authorization: "bearer\x20" + _0x2ae511,
        "Content-Type": _0x4a9d1b["ALlGc"],
        "Sec-Fetch-Dest": _0x4a9d1b["yGNbO"],
        "Sec-Fetch-Mode": _0x4a9d1b["ilxDU"],
        "Sec-Fetch-Site": "same-origi" + "n",
        "User-Agent": _0x4a9d1b["QNCPX"],
        "X-Upwork-Accept-Language": "en-US",
      },
      _0x3de0a0 = {
        query: _0x4a9d1b["iLbDw"],
        variables: {
          filter: {
            preferredLabel_any: "Angularjs",
            type: "SKILL",
            entityStatus_eq: _0x4a9d1b["BMVtd"],
            sortOrder: _0x4a9d1b["dLpxf"],
            limit: 0x32,
            includeAttributeGroups: ![],
          },
        },
      },
      _0x1ee290 = await _0x4a9d1b["KKpBm"](
        evaluate,
        _0x8615d5,
        _0x1f0ad2,
        _0x54b275,
        _0x3de0a0
      );
    if (_0x1ee290["data"]) {
      _0x20049b["oauth"] = _0x2ae511;
      break;
    }
  }
  return _0x20049b;
}
async function getSkillIds(_0x3f4f3d, _0x234f36) {
  const _0x17c9f0 = {
      jKcLr: function (_0x4ce3f1, _0x17d6e6) {
        return _0x4ce3f1(_0x17d6e6);
      },
      GtNul: function (_0x596a9a, _0x4dc301, _0x34d9c1) {
        return _0x596a9a(_0x4dc301, _0x34d9c1);
      },
      ENOBU: "GET-SKILL-" + "ID",
      PtGJw: function (_0x394011, _0x3a4c5a, _0x3b241c, _0x160240, _0x16501a) {
        return _0x394011(_0x3a4c5a, _0x3b241c, _0x160240, _0x16501a);
      },
    },
    _0x5d5b1a = _0x17c9f0["jKcLr"](generateGQLHeader, AUTH["oauth"]),
    _0x4dc3b8 = [];
  for (const _0x2a2e5b of _0x234f36) {
    const _0x4fcac1 = _0x17c9f0["GtNul"](generateBody, _0x17c9f0["ENOBU"], {
        skill: _0x2a2e5b,
      }),
      _0x3842b5 = await _0x17c9f0["PtGJw"](
        evaluate,
        _0x3f4f3d,
        GQL_URL,
        _0x5d5b1a,
        _0x4fcac1
      );
    _0x3842b5["data"] &&
      _0x4dc3b8["push"]({
        skillID:
          _0x3842b5["data"]["ontologyEl" + "ementsSear" + "chByPrefLa" + "bel"][
            -0x15d7 + 0x25d * 0x5 + 0xa06 * 0x1
          ]["id"],
      });
  }
  return _0x4dc3b8;
}
async function getServiceIds(_0x233eee, _0x47a523) {
  const _0x1fadc4 = {
      SeKuF: function (_0x570a89, _0x11c400) {
        return _0x570a89(_0x11c400);
      },
      jxcBl: function (_0x5b474e, _0x5b8a40, _0x5dfb56, _0x1dc556, _0x3fb4ce) {
        return _0x5b474e(_0x5b8a40, _0x5dfb56, _0x1dc556, _0x3fb4ce);
      },
    },
    _0x122a97 = generateGQLHeader(AUTH["oauth"]),
    _0x5e3b63 = [],
    _0x2ecb69 = _0x1fadc4["SeKuF"](generateBody, "GET-SERVIC" + "E-ID"),
    _0x206c87 = await _0x1fadc4["jxcBl"](
      evaluate,
      _0x233eee,
      GQL_URL,
      _0x122a97,
      _0x2ecb69
    );
  if (_0x206c87["data"]) {
    const _0x2f96a1 = [];
    _0x206c87["data"]["ontologyCa" + "tegories"]["forEach"]((_0x209662) => {
      _0x209662["subcategor" + "ies"]["forEach"]((_0x1c1410) => {
        _0x2f96a1["push"](_0x1c1410);
      });
    });
    for (const _0x2e4506 of _0x47a523) {
      for (const _0x13b487 of _0x2f96a1) {
        if (_0x13b487["preferredL" + "abel"] === _0x2e4506) {
          _0x5e3b63["push"](_0x13b487["id"]);
          continue;
        }
      }
    }
  }
  return _0x5e3b63;
}
async function getLocation(_0x12d946, _0x1f78bf, _0x1dd628) {
  const _0x3fc6f8 = {
      UrOQM: function (_0x11eb5f, _0x502c4a) {
        return _0x11eb5f(_0x502c4a);
      },
      rRGnu: function (_0x5e197a, _0x440fb3, _0x1580a1) {
        return _0x5e197a(_0x440fb3, _0x1580a1);
      },
      NNszW: function (_0x33a79f, _0x2326f3, _0x523527, _0x5c7e2e, _0x3f3b62) {
        return _0x33a79f(_0x2326f3, _0x523527, _0x5c7e2e, _0x3f3b62);
      },
    },
    _0x536493 = _0x3fc6f8["UrOQM"](generateGQLHeader, AUTH["oauth"]),
    _0x1c6392 = _0x3fc6f8["rRGnu"](generateBody, "GET-LOCATI" + "ON-DATA", {
      city: _0x1f78bf,
      countryCode: _0x1dd628,
    }),
    _0x47f89f = await _0x3fc6f8["NNszW"](
      evaluate,
      _0x12d946,
      GQL_URL,
      _0x536493,
      _0x1c6392
    );
  if (_0x47f89f["data"])
    return {
      city: _0x47f89f["data"]["citySearch" + "Records"][
        0x210a + 0x1364 + 0x2 * -0x1a37
      ]["city"]["name"],
      state:
        _0x47f89f["data"]["citySearch" + "Records"][
          0xb5 * -0x1 + 0xc2a + -0xb75
        ]["city"]["state"]["code"],
    };
}
async function generateProfile(_0x149cf1, _0x522f5f) {
  const _0x107e3f = {
      COfAX: "CREATE-PRO" + "FILE/EXPER" + "IENCE",
      WZeyc: "CREATE-PRO" + "FILE/GOAL",
      hseiq: "CREATE-PRO" + "FILE/WORK-" + "PREFERENCE" + "-1",
      JYCqD: "CREATE-PRO" + "FILE/WORK-" + "PREFERENCE" + "-2",
      ZNDSj: "START-PROF" + "ILE-PROCES" + "S",
      HZwBM: "api",
      FMpFX:
        "https://ww" +
        "w.upwork.c" +
        "om/ab/crea" +
        "te-profile" +
        "/api/min/v" +
        "1/start-pr" +
        "ofile-proc" +
        "ess",
      GhZVU: "profession" + "al",
      CUCBu: "education",
      iEdkg: "CREATE-PRO" + "FILE/LANGU" + "AGES",
      HPhGj: "skills",
      ModpW: "CREATE-PRO" + "FILE/OVERV" + "IEW",
      makKv: "overview",
      JzvTg: "CREATE-PRO" + "FILE/CATEG" + "ORIES",
      XBTri: function (_0x348d07, _0x2660f5, _0x29f810) {
        return _0x348d07(_0x2660f5, _0x29f810);
      },
      oDyvf: "services",
      XthyV: "hourRate",
      uLkWc: "CREATE-PRO" + "FILE/BIRTH" + "DAY",
      VCOgY: "birthday",
      RvbeB: "city",
      dSbaX: "CREATE-PRO" + "FILE/ADDR&" + "PHONE",
      GtwkB: "street",
      EtmlR: "zipcode",
      uOShF: "country",
      hwJnL: function (_0x4f113d) {
        return _0x4f113d();
      },
      phLxJ: "countryCod" + "e",
      xEEwW:
        "https://ww" +
        "w.upwork.c" +
        "om/ab/crea" +
        "te-profile" +
        "/api/min/v" +
        "1/save-add" +
        "ress-phone",
      GCINW: "REVIEW",
      irjAx:
        "https://ww" +
        "w.upwork.c" +
        "om/ab/crea" +
        "te-profile" +
        "/api/v1/re" +
        "view",
      feOnC: "NOTIFICATI" + "ON",
    },
    _0xe2e713 = { first: [], last: [] };
  _0xe2e713["first"]["push"]({ type: _0x107e3f["COfAX"], data: null }),
    _0xe2e713["first"]["push"]({ type: _0x107e3f["WZeyc"], data: null }),
    _0xe2e713["first"]["push"]({ type: _0x107e3f["hseiq"], data: null }),
    _0xe2e713["first"]["push"]({ type: _0x107e3f["JYCqD"], data: null }),
    _0xe2e713["first"]["push"]({
      type: _0x107e3f["ZNDSj"],
      method: _0x107e3f["HZwBM"],
      url: _0x107e3f["FMpFX"],
      data: null,
    }),
    _0xe2e713["first"]["push"]({
      type: "CREATE-PRO" + "FILE/TITLE",
      data: { title: _0x522f5f[_0x107e3f["GhZVU"]] },
    }),
    _0xe2e713["first"]["push"]({
      type: "CREATE-PRO" + "FILE/EMPLO" + "YMENT",
      data: { employment: _0x522f5f["workXP"] },
    }),
    _0xe2e713["first"]["push"]({
      type: "CREATE-PRO" + "FILE/EDUCA" + "TION",
      data: { education: _0x522f5f[_0x107e3f["CUCBu"]] },
    }),
    _0xe2e713["first"]["push"]({ type: _0x107e3f["iEdkg"], data: null }),
    _0xe2e713["first"]["push"]({
      type: "CREATE-PRO" + "FILE/SKILL" + "S",
      data: {
        skills: await getSkillIds(_0x149cf1, _0x522f5f[_0x107e3f["HPhGj"]]),
      },
    }),
    _0xe2e713["first"]["push"]({
      type: _0x107e3f["ModpW"],
      data: { overview: _0x522f5f[_0x107e3f["makKv"]] },
    }),
    _0xe2e713["first"]["push"]({
      type: _0x107e3f["JzvTg"],
      data: {
        categories: await _0x107e3f["XBTri"](
          getServiceIds,
          _0x149cf1,
          _0x522f5f[_0x107e3f["oDyvf"]]
        ),
      },
    }),
    _0xe2e713["first"]["push"]({
      type: "CREATE-PRO" + "FILE/RATE",
      data: { rate: _0x522f5f[_0x107e3f["XthyV"]] },
    }),
    _0xe2e713["first"]["push"]({
      type: _0x107e3f["uLkWc"],
      data: { birthday: _0x522f5f[_0x107e3f["VCOgY"]] },
    });
  const { city: _0x3b8d75, state: _0xc22172 } = await getLocation(
    _0x149cf1,
    _0x522f5f[_0x107e3f["RvbeB"]],
    _0x522f5f["countryCod" + "e"]
  );
  return (
    _0xe2e713["first"]["push"]({
      type: _0x107e3f["dSbaX"],
      data: {
        street: _0x522f5f[_0x107e3f["GtwkB"]],
        state: _0xc22172,
        city: _0x3b8d75,
        zip: _0x522f5f[_0x107e3f["EtmlR"]],
        country: _0x522f5f[_0x107e3f["uOShF"]],
        phone: _0x107e3f["hwJnL"](generatePhoneNumber),
        phoneCode: _0x522f5f[_0x107e3f["phLxJ"]],
      },
      method: _0x107e3f["HZwBM"],
      url: _0x107e3f["xEEwW"],
    }),
    (_0xe2e713["last"] = [
      { type: "COMPLETE-O" + "NBOARDING", data: null },
      {
        type: _0x107e3f["GCINW"],
        method: _0x107e3f["HZwBM"],
        url: _0x107e3f["irjAx"],
        data: null,
      },
      {
        type: _0x107e3f["feOnC"],
        method: _0x107e3f["HZwBM"],
        url:
          "https://ww" +
          "w.upwork.c" +
          "om/ab/noti" +
          "fication-s" +
          "ettings/ap" +
          "i/settings",
        data: null,
      },
    ]),
    _0xe2e713
  );
}
async function handleRequest(_0x2d5a4c, _0x232297) {
  const _0x4ee891 = {
    YMJIH: function (_0x2a2ab9, _0x49da49, _0x21025) {
      return _0x2a2ab9(_0x49da49, _0x21025);
    },
    csuib: function (_0x3e6104, _0x4825f, _0x5e12f0, _0xea1b3b, _0x3a97fc) {
      return _0x3e6104(_0x4825f, _0x5e12f0, _0xea1b3b, _0x3a97fc);
    },
    jAbVK: function (_0x2f5ca4, _0x109c88) {
      return _0x2f5ca4(_0x109c88);
    },
    MTbMH: "[PASS]",
  };
  for (const _0x2a8e20 of _0x232297) {
    if (_0x2a8e20["method"] === "api") {
      const _0x149d4a = _0x4ee891["YMJIH"](
          generateAPIHeader,
          AUTH["oauth"],
          AUTH["token"]
        ),
        _0x322dcb = _0x4ee891["YMJIH"](
          generateBody,
          _0x2a8e20["type"],
          _0x2a8e20["data"]
        );
      await _0x4ee891["csuib"](
        evaluate,
        _0x2d5a4c,
        _0x2a8e20["url"],
        _0x149d4a,
        _0x322dcb
      );
    } else {
      const _0x408a50 = _0x4ee891["jAbVK"](generateGQLHeader, AUTH["oauth"]),
        _0x4a139a = _0x4ee891["YMJIH"](
          generateBody,
          _0x2a8e20["type"],
          _0x2a8e20["data"]
        );
      await evaluate(_0x2d5a4c, GQL_URL, _0x408a50, _0x4a139a);
    }
    console["log"](_0x4ee891["MTbMH"], _0x2a8e20["type"]);
  }
}
async function Login(_0x2bc1e4) {
  const _0x3c9ca3 = {
    SMuAh: function (_0x13379c, _0x4abdbf) {
      return _0x13379c === _0x4abdbf;
    },
    ruRHh: function (_0x402c64, _0x5e497c) {
      return _0x402c64(_0x5e497c);
    },
    aSGqO: function (_0x440d2d, _0x567f8e) {
      return _0x440d2d + _0x567f8e;
    },
    IuyXn: "first_name",
    fhzfW: "last_name",
    dpqxi: function (_0x53a97e, _0x33f46c) {
      return _0x53a97e === _0x33f46c;
    },
    jhFCs: "minuteinbo" + "x",
    tuhTD: function (_0x3a5daf) {
      return _0x3a5daf();
    },
    WgZUi: "--start-ma" + "ximized",
    FhCYF: "false",
    RMBSC: function (_0x1bc544, _0xa61be2) {
      return _0x1bc544 == _0xa61be2;
    },
    MvHOA: "linux",
    chgzb: "--no-sandb" + "ox",
    RQfEU: "request",
    jQXkG: "requestfin" + "ished",
    wDeqs: "https://ww" + "w.upwork.c" + "om/nx/sign" + "up/?dest=h" + "ome",
    SULXX: "networkidl" + "e0",
    oqCZX: function (_0x96d8be, _0x46b84b) {
      return _0x96d8be(_0x46b84b);
    },
    LyCRa: "input[name" + "=\x22radio-gr" + "oup-2\x22]",
    XbrRX: function (_0x47095e, _0x2a739f) {
      return _0x47095e(_0x2a739f);
    },
    Tqeta: "button[dat" + "a-qa=\x22btn-" + "apply\x22]",
    LAUxf: function (_0x8baf00, _0x590010, _0x5f2976, _0x47812e) {
      return _0x8baf00(_0x590010, _0x5f2976, _0x47812e);
    },
    Matid: "#first-nam" + "e-input",
    cOWbC: function (_0x192c10, _0x9c8b01, _0xa20d9e, _0x522470) {
      return _0x192c10(_0x9c8b01, _0xa20d9e, _0x522470);
    },
    ZFjTr: "#last-name" + "-input",
    nAGMS: function (_0x160562, _0x172ab4, _0x462303, _0x44600c) {
      return _0x160562(_0x172ab4, _0x462303, _0x44600c);
    },
    UoRph: "#redesigne" + "d-input-em" + "ail",
    cYUVL: function (_0x5b9014, _0x16bc14, _0x26ea90, _0x5c6264) {
      return _0x5b9014(_0x16bc14, _0x26ea90, _0x5c6264);
    },
    ewkwR: function (_0x4fddad, _0x332491) {
      return _0x4fddad(_0x332491);
    },
    HCWYR: "[Info]\x20Ver" + "ifying\x20...",
    JZWhD: function (_0x3f8e94, _0x340d71) {
      return _0x3f8e94 < _0x340d71;
    },
    mBrto: "generator." + "email",
    hjjYL: function (_0x2ee708, _0x3296ac) {
      return _0x2ee708 === _0x3296ac;
    },
    KCzZt: function (_0x2a0f35, _0x2c89c6, _0x51309e) {
      return _0x2a0f35(_0x2c89c6, _0x51309e);
    },
    rrluJ: "Verify\x20lin" + "k\x20not\x20foun" + "d",
    KvZdv: function (_0x5a508c, _0x46d8e9) {
      return _0x5a508c(_0x46d8e9);
    },
    hTJFB: ".up-btn-pr" + "imary",
    BBfPj: "Verifycati" + "on\x20link\x20no" + "t\x20found",
    YeoMe: "https://ww" + "w.upwork.c" + "om/nx/crea" + "te-profile" + "/",
    SyBRT: function (_0x232566, _0x2ab0e6, _0x46df98) {
      return _0x232566(_0x2ab0e6, _0x46df98);
    },
    btxKr: function (_0x4514a5, _0x3541cc, _0x566efc) {
      return _0x4514a5(_0x3541cc, _0x566efc);
    },
    CPmkk: "button[dat" + "a-qa=\x22open" + "-loader\x22]",
    MRBSI: "profiles",
    CZFjM: "avatar",
    BgZwE: "input[type" + "=\x22file\x22]",
    xhCsd:
      "==========" +
      "==========" +
      "=======\x20Ac" +
      "count\x20has\x20" +
      "been\x20creat" +
      "ed\x20success" +
      "fully\x20====" +
      "==========" +
      "==========" +
      "==",
    OFWCh:
      "==========" +
      "==========" +
      "=======\x20Ac" +
      "count\x20info" +
      "\x20is\x20saved\x20" +
      "to\x20the\x20dat" +
      "abase\x20succ" +
      "essfully\x20=" +
      "==========" +
      "==========" +
      "=====",
    sRosS: "Log\x20=>\x20err" + "or:\x20",
  };
  let _0x4040f1, _0x42e504;
  if (process["env"]["TEMP_EMAIL"] === "generator." + "email")
    _0x4040f1 = await _0x3c9ca3["ruRHh"](
      generateEmail,
      _0x3c9ca3["aSGqO"](
        _0x2bc1e4[_0x3c9ca3["IuyXn"]],
        _0x2bc1e4[_0x3c9ca3["fhzfW"]]
      )
    );
  else {
    if (_0x3c9ca3["dpqxi"](process["env"]["TEMP_EMAIL"], _0x3c9ca3["jhFCs"]))
      ({ email: _0x4040f1, accessToken: _0x42e504 } = await _0x3c9ca3["tuhTD"](
        generateAddress
      ));
  }
  console["log"](
    "==========" +
      "==========" +
      "\x20" +
      _0x4040f1 +
      ("\x20=========" + "==========" + "=")
  );
  let _0x318145 = _0x47f17c["join"](
      _0x17973d["tmpdir"](),
      _0x3c9ca3["aSGqO"]("puppeteer_", Date["now"]()) +
        Math["random"]()
          ["toString"](-0x9f5 + 0x8 * -0xcd + 0xa9 * 0x19)
          ["substr"](
            0x1 * -0x115 + 0x32a * 0x6 + -0x11e5,
            0x179d + -0x1d24 + 0x58c
          )
    ),
    _0xd98a7f = {
      defaultViewport: null,
      userDataDir: _0x318145,
      args: [_0x3c9ca3["WgZUi"]],
    },
    _0xedc058 = process["env"]["HEADLESS"];
  _0xd98a7f["headless"] = _0xedc058;
  if (_0xedc058 == _0x3c9ca3["FhCYF"]) _0xd98a7f["headless"] = ![];
  console["log"]("Log\x20=>\x20HEA" + "DLESS:\x20", _0xd98a7f["headless"]);
  if (_0x3c9ca3["RMBSC"](process["platform"], _0x3c9ca3["MvHOA"]))
    _0xd98a7f["args"]["push"](_0x3c9ca3["chgzb"]);
  const _0x2f4ca0 = await _0x1dff80["launch"](_0xd98a7f),
    _0x5a544b = await _0x2f4ca0["newPage"]();
  let _0x46f99c = ![];
  try {
    await _0x5a544b["setRequest" + "Intercepti" + "on"](!![]),
      _0x5a544b["on"](_0x3c9ca3["RQfEU"], (_0x3edacd) => {
        _0x3edacd["continue"]();
      });
    const _0x311cf6 =
      "https://ww" +
      "w.upwork.c" +
      "om/ab/crea" +
      "te-profile" +
      "/api/v2/po" +
      "rtrait-upl" +
      "oad";
    _0x5a544b["on"](_0x3c9ca3["jQXkG"], (_0x426995) => {
      _0x3c9ca3["SMuAh"](_0x426995["url"](), _0x311cf6) &&
        ((_0x46f99c = !![]),
        console["log"](
          "[INFO]\x20Ava" + "tar\x20is\x20upl" + "oaded\x20succ" + "essfully"
        ));
    }),
      await _0x5a544b["setCacheEn" + "abled"](![]),
      await _0x5a544b["goto"](_0x3c9ca3["wDeqs"], {
        waitUntil: _0x3c9ca3["SULXX"],
      }),
      await _0x3c9ca3["oqCZX"](click, {
        component: _0x5a544b,
        selector: _0x3c9ca3["LyCRa"],
      }),
      await _0x3c9ca3["XbrRX"](click, {
        component: _0x5a544b,
        selector: _0x3c9ca3["Tqeta"],
      }),
      await _0x3c9ca3["LAUxf"](
        input,
        _0x5a544b,
        _0x3c9ca3["Matid"],
        _0x2bc1e4["first_name"]
      ),
      await _0x3c9ca3["cOWbC"](
        input,
        _0x5a544b,
        _0x3c9ca3["ZFjTr"],
        _0x2bc1e4[_0x3c9ca3["fhzfW"]]
      ),
      await _0x3c9ca3["nAGMS"](input, _0x5a544b, _0x3c9ca3["UoRph"], _0x4040f1),
      await _0x3c9ca3["cYUVL"](
        input,
        _0x5a544b,
        "#password-" + "input",
        process["env"]["PASSWORD"]
      ),
      await _0x3c9ca3["oqCZX"](click, {
        component: _0x5a544b,
        selector: "input#chec" + "kbox-terms",
      }),
      await click({
        component: _0x5a544b,
        selector: "input#chec" + "kbox-promo",
      }),
      await _0x3c9ca3["ewkwR"](click, {
        component: _0x5a544b,
        selector: "#button-su" + "bmit-form",
      }),
      await _0x5a544b["waitForNav" + "igation"](),
      console["log"](_0x3c9ca3["HCWYR"]);
    let _0x177ee2 = null,
      _0x21b757 = -0x35 * 0x71 + -0x2154 + 0x38ba;
    while (!![]) {
      for (
        let _0x5d3f2b = -0x684 + -0x2e * 0x8d + 0x2 * 0xfed;
        _0x3c9ca3["JZWhD"](_0x5d3f2b, 0x24e * 0x8 + -0x1a5c + 0x7f1);
        _0x5d3f2b++
      ) {
        if (
          _0x3c9ca3["dpqxi"](process["env"]["TEMP_EMAIL"], _0x3c9ca3["mBrto"])
        )
          _0x177ee2 = await getEmailVeryfyLink(_0x4040f1);
        else {
          if (
            _0x3c9ca3["hjjYL"](process["env"]["TEMP_EMAIL"], _0x3c9ca3["jhFCs"])
          )
            _0x177ee2 = await _0x3c9ca3["KCzZt"](
              getVerifyLink,
              _0x4040f1,
              _0x42e504
            );
        }
        if (_0x177ee2) break;
        console["log"](_0x3c9ca3["rrluJ"]),
          await _0x3c9ca3["KvZdv"](
            wait,
            -0x23 * 0xe7 + -0x5e7 * -0x2 + -0x8f * -0x29
          );
      }
      if (_0x177ee2 || _0x21b757 === 0x1689 + 0x343 + -0x1 * 0x19ca) {
        console["log"](_0x177ee2);
        break;
      }
      const _0x446a03 = await _0x5a544b["waitForSel" + "ector"](
        _0x3c9ca3["hTJFB"]
      );
      await _0x446a03["click"](),
        (_0x21b757 += 0xd8e + 0x32b * 0x3 + 0xb87 * -0x2);
    }
    if (!_0x177ee2) throw new Error(_0x3c9ca3["BBfPj"]);
    await _0x5a544b["goto"](_0x177ee2, { waitUntil: _0x3c9ca3["SULXX"] }),
      await _0x5a544b["goto"](_0x3c9ca3["YeoMe"], {
        waitUntil: _0x3c9ca3["SULXX"],
      }),
      (AUTH = await getAuthData(_0x5a544b));
    const _0x58f9c0 = await _0x3c9ca3["SyBRT"](
      generateProfile,
      _0x5a544b,
      _0x2bc1e4
    );
    await _0x3c9ca3["btxKr"](handleRequest, _0x5a544b, _0x58f9c0["first"]),
      await _0x5a544b["goto"](
        "https://ww" + "w.upwork.c" + "om/nx/crea" + "te-profile" + "/location"
      ),
      await _0x3c9ca3["oqCZX"](click, {
        component: _0x5a544b,
        selector: _0x3c9ca3["CPmkk"],
      });
    const _0x5c7269 = _0x47f17c["join"](
      process["cwd"](),
      _0x3c9ca3["MRBSI"],
      _0x2bc1e4[_0x3c9ca3["CZFjM"]]
    );
    await _0x5a544b["waitForSel" + "ector"](_0x3c9ca3["BgZwE"]);
    const [_0xf755c8] = await Promise["all"]([
      _0x5a544b["waitForFil" + "eChooser"](),
      _0x5a544b["click"](_0x3c9ca3["BgZwE"]),
    ]);
    await _0xf755c8["accept"]([_0x5c7269]),
      await _0x3c9ca3["ewkwR"](wait, 0xf * 0x79 + -0x61c * 0x3 + 0x133 * 0xb);
    const _0x3a34c8 = await _0x5a544b["waitForSel" + "ector"](
      "button[dat" + "a-qa=\x22btn-" + "save\x22]"
    );
    await _0x3a34c8["click"]();
    while (!_0x46f99c) {
      await wait(-0x15d * 0xd + 0x2 * 0xb3d + 0x395 * -0x1);
    }
    await handleRequest(_0x5a544b, _0x58f9c0["last"]),
      console["log"](_0x3c9ca3["xhCsd"]);
    if (_0x3c9ca3["dpqxi"](process["env"]["TEMP_EMAIL"], _0x3c9ca3["mBrto"]))
      saveAccount({
        email: _0x4040f1,
        name: _0x3c9ca3["aSGqO"](
          _0x2bc1e4[_0x3c9ca3["IuyXn"]],
          _0x2bc1e4[_0x3c9ca3["fhzfW"]]
        ),
        status: "active",
        type: _0x3c9ca3["mBrto"],
      });
    else
      process["env"]["TEMP_EMAIL"] === _0x3c9ca3["jhFCs"] &&
        _0x3c9ca3["oqCZX"](saveAccount, {
          email: _0x4040f1,
          name: _0x3c9ca3["aSGqO"](
            _0x2bc1e4[_0x3c9ca3["IuyXn"]],
            _0x2bc1e4["last_name"]
          ),
          status: "active",
          token: _0x42e504,
          type: _0x3c9ca3["jhFCs"],
        });
    console["log"](_0x3c9ca3["OFWCh"]), _0x2f4ca0["close"]();
  } catch (_0x1f0107) {
    console["log"](_0x3c9ca3["sRosS"], _0x1f0107), _0x2f4ca0["close"]();
  }
  return !![];
}
async function main() {
  const _0xe5705 = {
    xJLzt: function (_0x3563fc, _0x15e231) {
      return _0x3563fc + _0x15e231;
    },
    RLnDQ: ".json",
    atUld: "Log\x20=>\x20err" + ":\x20",
  };
  try {
    const _0x14b6e7 = _0x47f17c["join"](
      process["cwd"](),
      "profiles",
      _0xe5705["xJLzt"](
        process["argv"][-0x17b6 + 0x1dc7 + -0x60f],
        _0xe5705["RLnDQ"]
      )
    );
    let _0x4c60e9 = await readFileAsync(_0x14b6e7);
    _0x4c60e9 = JSON["parse"](_0x4c60e9);
    let _0x16f21d = await Login(_0x4c60e9);
    return console["log"]("Log\x20=>\x20ret" + ":\x20", _0x16f21d), !![];
  } catch (_0x21b885) {
    return console["log"](_0xe5705["atUld"], _0x21b885), ![];
  }
}
(async () => {
  const _0x1b0d9f = {
    MrNdT: function (_0x1e92b2, _0x2f77d9) {
      return _0x1e92b2 === _0x2f77d9;
    },
    QzSst: function (_0x798d9d) {
      return _0x798d9d();
    },
    WycXe: "en-US",
    pMvyI: "Asia/Tokyo",
    SspWP: function (_0x592fd9, _0x587307) {
      return _0x592fd9 < _0x587307;
    },
    pHteK: function (_0x1081bc, _0x41743a) {
      return _0x1081bc(_0x41743a);
    },
    rdXvB: function (_0xb1d3ea) {
      return _0xb1d3ea();
    },
    VAhEt: function (_0x44ec30, _0xf5088c) {
      return _0x44ec30 < _0xf5088c;
    },
    tMuIb: function (_0x1d28e2, _0x498e15) {
      return _0x1d28e2(_0x498e15);
    },
  };
  try {
    if (
      _0x1b0d9f["MrNdT"](process["argv"][0x11 * 0xc9 + 0x20c6 + -0x2e1c], "inf")
    )
      while (!![]) {
        const _0x1e0379 = await _0x1b0d9f["QzSst"](getRemainedEmail);
        console["log"](
          new Date()["toLocaleSt" + "ring"](_0x1b0d9f["WycXe"], {
            timeZone: _0x1b0d9f["pMvyI"],
          })
        );
        if (
          _0x1b0d9f["SspWP"](
            _0x1e0379,
            _0x1b0d9f["pHteK"](eval, process["env"]["DEFAULT_AC" + "COUNT"])
          )
        )
          await _0x1b0d9f["rdXvB"](main);
        else
          await _0x1b0d9f["pHteK"](
            wait,
            0x5 * -0x33a + -0x11 * 0xbb + -0x1 * -0x2075
          );
      }
    else
      for (
        let _0x2b4147 = -0x2091 + 0x1c2c + 0x465;
        _0x1b0d9f["VAhEt"](
          _0x2b4147,
          _0x1b0d9f["tMuIb"](
            eval,
            process["argv"][-0x2 * -0x241 + -0xeb1 + -0x91 * -0x12]
          )
        );
        _0x2b4147++
      ) {
        console["log"](
          "==========" +
            "==\x20" +
            (_0x2b4147 + (-0x5a * -0x2f + 0x38d * 0x1 + -0x1412 * 0x1)) +
            ("\x20=========" + "=")
        );
        const _0xc40431 = await _0x1b0d9f["QzSst"](getRemainedEmail);
        console["log"](
          new Date()["toLocaleSt" + "ring"](_0x1b0d9f["WycXe"], {
            timeZone: _0x1b0d9f["pMvyI"],
          })
        ),
          await _0x1b0d9f["QzSst"](main);
      }
  } catch (_0x22e3dc) {
    console["log"](_0x22e3dc);
  }
  process["exit"]();
})();
