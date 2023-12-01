import _0x5ea662 from "dotenv";
import _0x50e8c8 from "os";
import _0x129210 from "path";
import _0x60e4eb from "puppeteer-extra";
import _0x4798d9 from "puppeteer-extra-plugin-stealth";
import { click } from "puppeteer-utilz";
import {
  findJob,
  getAvailableEmail,
  removeAccount,
  saveJob,
  updateStatus,
} from "./firebase/firebase.js";
import _0x200a5c from "./getBidMessage.js";
import { evaluate, wait } from "./utils.js";
const stealth = _0x4798d9();
_0x60e4eb["use"](_0x4798d9()),
  stealth["enabledEva" + "sions"]["delete"]("iframe.con" + "tentWindow"),
  _0x5ea662["config"]();
let AUTH = { token: "", oauth: "", uid: "", oDeskUserID: "" },
  MODE = process["env"]["BID_MODE"] * (-0x78f + -0xb2a + 0x12ba),
  DISABLE_COUNTRY = ["India", "Pakistan", "Korea"];
async function input(
  _0x3476f7,
  _0x21a934,
  _0x55dbab,
  _0x196496 = -0x62b * 0x1 + -0x8d2 + 0xefd
) {
  await _0x3476f7["waitForSel" + "ector"](_0x21a934),
    await _0x3476f7["type"](_0x21a934, _0x55dbab, { delay: _0x196496 });
}
async function filterJob(_0x2c07e6, _0x3ab027) {
  const _0xb00507 = {
      zDCWc: "gzip,\x20defl" + "ate,\x20br",
      YvKPn: "empty",
      HRcDn: "cors",
      myeIQ: function (_0x5a30fa, _0x13107e, _0x206eb5, _0xb93ee0) {
        return _0x5a30fa(_0x13107e, _0x206eb5, _0xb93ee0);
      },
      tMEjh: function (_0x4ac45b, _0x51e83) {
        return _0x4ac45b > _0x51e83;
      },
      ScWvg: function (_0x4b5928, _0x2a7934) {
        return _0x4b5928 < _0x2a7934;
      },
      ixNGD: function (_0x8aa91b, _0x3335c8) {
        return _0x8aa91b * _0x3335c8;
      },
    },
    _0x434d02 =
      "https://ww" +
      "w.upwork.c" +
      "om/ab/prop" +
      "osals/api/" +
      "openings/" +
      _0x3ab027,
    _0x15a8b9 = {
      Accept: "applicatio" + "n/json,\x20te" + "xt/plain,\x20" + "*/*",
      "Accept-Encoding": _0xb00507["zDCWc"],
      "Accept-Language": "en-US,en;q" + "=0.9",
      Authorization: "Bearer\x20" + AUTH["oauth"],
      "Sec-Fetch-Dest": _0xb00507["YvKPn"],
      "Sec-Fetch-Mode": _0xb00507["HRcDn"],
      "Sec-Fetch-Site": "same-origi" + "n",
      "x-odesk-user-agent": "oDesk\x20LM",
      "x-requested-with": "XMLHttpReq" + "uest",
      "X-Upwork-Accept-Language": "en-US",
    },
    _0x54ae23 = await _0xb00507["myeIQ"](
      evaluate,
      _0x2c07e6,
      _0x434d02,
      _0x15a8b9
    );
  if (
    _0xb00507["tMEjh"](
      _0x54ae23["opening"]["job"]["budget"]["amount"],
      -0xa13 + -0x1483 + -0xa * -0x30f
    ) &&
    _0xb00507["ScWvg"](
      _0x54ae23["opening"]["job"]["budget"]["amount"],
      _0xb00507["ixNGD"](
        process["env"]["MIN_BUDGET"],
        0xc72 + 0x18f7 * -0x1 + -0x2 * -0x643
      )
    )
  )
    return "===\x20go\x20awa" + "y\x20===";
  for (const _0x25131a of DISABLE_COUNTRY) {
    if (
      _0x54ae23["organizati" + "on"]["contact"]["country"]
        ["toLowerCas" + "e"]()
        ["indexOf"](_0x25131a["toLowerCas" + "e"]()) >
      -(0x361 * -0xb + -0x20ad + -0x1 * -0x45d9)
    )
      return "===\x20go\x20awa" + "y\x20===";
  }
  if (
    _0xb00507["tMEjh"](
      _0x54ae23["opening"]["title"]["indexOf"]("Expensify"),
      -(0x17 * 0xdf + 0xd37 * -0x2 + 0x666)
    )
  )
    return "===\x20go\x20awa" + "y\x20===";
  return _0x3ab027;
}
async function getAuthData(_0x1f5fd4) {
  const _0x4bb00f = {
      eEvsB: function (_0x4eeae6, _0x1bd53e) {
        return _0x4eeae6 === _0x1bd53e;
      },
      bDlvV: "oauth2_glo" + "bal_js_tok" + "en",
      XAedE: function (_0x4c5bef, _0x1cb5a9) {
        return _0x4c5bef === _0x1cb5a9;
      },
      nAQBS: "user_uid",
      eTkGY: "console_us" + "er",
    },
    _0x30b5e5 = { token: "", oauth: "", uid: "", oDeskUserID: "" },
    _0x23afe2 = [],
    _0x1d254b = await _0x1f5fd4["cookies"]();
  for (const _0x161d31 of _0x1d254b) {
    if (_0x161d31["name"] === "XSRF-TOKEN")
      _0x30b5e5["token"] = _0x161d31["value"];
    if (_0x4bb00f["eEvsB"](_0x161d31["name"], _0x4bb00f["bDlvV"]))
      _0x30b5e5["oauth"] = _0x161d31["value"];
    if (_0x4bb00f["XAedE"](_0x161d31["name"], _0x4bb00f["nAQBS"]))
      _0x30b5e5["uid"] = _0x161d31["value"];
    if (_0x161d31["name"] === _0x4bb00f["eTkGY"])
      _0x30b5e5["oDeskUserI" + "D"] = _0x161d31["value"];
  }
  return _0x30b5e5;
}
async function getNewJob(_0x17da81) {
  const _0x539970 = {
    mRkTn: function (_0x4acae0, _0x40b505) {
      return _0x4acae0 === _0x40b505;
    },
    ofIQJ: function (_0x3f3e71, _0x16107f) {
      return _0x3f3e71 === _0x16107f;
    },
    bUPMj:
      "https://ww" +
      "w.upwork.c" +
      "om/ab/find" +
      "-work/api/" +
      "feeds/embe" +
      "ddings-rec" +
      "ommendatio" +
      "ns?paging=" +
      "0%3B10",
    KMtTo: "applicatio" + "n/json,\x20te" + "xt/plain,\x20" + "*/*",
    awZVF: "gzip,\x20defl" + "ate,\x20br",
    gOobz: "en-US,en;q" + "=0.9",
    cJKjM: "empty",
    Attiz: "cors",
    NGAhs: "oDesk\x20LM",
    TxwEQ: "en-US",
    eCpnw: function (_0x1316f0, _0x45fe04, _0xa43221, _0x378880) {
      return _0x1316f0(_0x45fe04, _0xa43221, _0x378880);
    },
  };
  let _0x3279d2;
  if (_0x539970["mRkTn"](MODE, 0x4f * -0x52 + 0x5 * -0x2e1 + 0x27b3))
    _0x3279d2 = process["env"]["SEARCH_API"];
  else
    _0x539970["ofIQJ"](MODE, -0x1a99 + -0x21c7 + 0x3c61) &&
      (_0x3279d2 = _0x539970["bUPMj"]);
  const _0x5289c2 = {
      Accept: _0x539970["KMtTo"],
      "Accept-Encoding": _0x539970["awZVF"],
      "Accept-Language": _0x539970["gOobz"],
      Authorization: "Bearer\x20" + AUTH["oauth"],
      "Sec-Fetch-Dest": _0x539970["cJKjM"],
      "Sec-Fetch-Mode": _0x539970["Attiz"],
      "Sec-Fetch-Site": "same-origi" + "n",
      "x-odesk-user-agent": _0x539970["NGAhs"],
      "x-requested-with": "XMLHttpReq" + "uest",
      "X-Upwork-Accept-Language": _0x539970["TxwEQ"],
    },
    _0x39b34f = await _0x539970["eCpnw"](
      evaluate,
      _0x17da81,
      _0x3279d2,
      _0x5289c2
    );
  if (_0x539970["mRkTn"](MODE, -0x18d1 + 0xe5 * -0x1 + 0x19b6))
    return {
      title:
        _0x39b34f["searchResu" + "lts"]["jobs"][
          0x13 * 0x3a + 0xc65 + 0x1 * -0x10b3
        ]["title"],
      description:
        _0x39b34f["searchResu" + "lts"]["jobs"][0x22ed + 0x3 * 0x755 + -0x38ec][
          "descriptio" + "n"
        ],
      jobId:
        _0x39b34f["searchResu" + "lts"]["jobs"][-0xfbd + 0xa6f + -0x61 * -0xe][
          "ciphertext"
        ],
    };
  else {
    if (MODE === 0x106 + -0x1 * -0x1df5 + -0x7a * 0x41)
      return {
        title:
          _0x39b34f["results"][-0x765 + -0xb * 0x3c + -0x9f9 * -0x1]["title"],
        description:
          _0x39b34f["results"][0xc9a + -0x3 * 0xc + -0xc76]["descriptio" + "n"],
        jobId: _0x39b34f["results"][-0x23b8 + 0x18a3 + 0xb15]["ciphertext"],
      };
  }
}
async function getJobDetail(_0x5c09f2, _0x4ce5a4) {
  const _0x252d2f = {
      KDUBQ: "applicatio" + "n/json,\x20te" + "xt/plain,\x20" + "*/*",
      pxqQT: "gzip,\x20defl" + "ate,\x20br",
      wGoUq: "en-US,en;q" + "=0.9",
      oQGca: "same-origi" + "n",
      xuWGd: "oDesk\x20LM",
      bxaMK: "XMLHttpReq" + "uest",
      RmPIj: "en-US",
      SpJeZ: function (_0x4156f8, _0x2a3511, _0x14f341, _0x4d69dd) {
        return _0x4156f8(_0x2a3511, _0x14f341, _0x4d69dd);
      },
      ArbBD: function (_0x116e77, _0x1114a5) {
        return _0x116e77(_0x1114a5);
      },
      yulwE: function (_0x559cd8, _0x291e79) {
        return _0x559cd8 === _0x291e79;
      },
      vAoXJ: function (_0x2c0dd5, _0x5f1765) {
        return _0x2c0dd5 > _0x5f1765;
      },
    },
    _0x58df63 =
      "https://ww" +
      "w.upwork.c" +
      "om/ab/prop" +
      "osals/api/" +
      "openings/" +
      _0x4ce5a4,
    _0x4b2b2a =
      "https://ww" +
      "w.upwork.c" +
      "om/ab/prop" +
      "osals/api/" +
      "v4/job/det" +
      "ails/" +
      _0x4ce5a4,
    _0x2a51f4 = {
      Accept: _0x252d2f["KDUBQ"],
      "Accept-Encoding": _0x252d2f["pxqQT"],
      "Accept-Language": _0x252d2f["wGoUq"],
      Authorization: "Bearer\x20" + AUTH["oauth"],
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": _0x252d2f["oQGca"],
      "x-odesk-user-agent": _0x252d2f["xuWGd"],
      "x-requested-with": _0x252d2f["bxaMK"],
      "X-Upwork-Accept-Language": _0x252d2f["RmPIj"],
    },
    _0x752d0f = await evaluate(_0x5c09f2, _0x58df63, _0x2a51f4),
    _0x30f3a7 = await _0x252d2f["SpJeZ"](
      evaluate,
      _0x5c09f2,
      _0x4b2b2a,
      _0x2a51f4
    ),
    _0x558712 = await _0x252d2f["ArbBD"](
      _0x200a5c,
      _0x752d0f["opening"]["job"]["descriptio" + "n"]
    ),
    _0xfa3242 = {
      version: 0x3,
      jobReference: _0x752d0f["opening"]["job"]["openingUid"],
      agency: null,
      chargedAmount: _0x252d2f["yulwE"](
        _0x752d0f["opening"]["job"]["budget"]["amount"],
        0x24f5 * -0x1 + 0x1a * 0x1d + 0x2203
      )
        ? 0x163b + -0xe * 0xf7 + -0x89b
        : _0x752d0f["opening"]["job"]["budget"]["amount"],
      coverLetter: _0x558712,
      earnedAmount: null,
      estimatedDuration: null,
      occupationUID: null,
      portfolioItemUids: [],
      attachments: [],
      questions: [],
      milestones: [],
      readyToStartDate: null,
      selectedContractor: {
        uid: AUTH["uid"],
        oDeskUserID: AUTH["oDeskUserI" + "D"],
      },
      profileRateToSet: ![],
      boostBidAmount: 0x32,
      rateGuidance: null,
      agencyOrgUid: null,
    };
  if (
    _0x252d2f["yulwE"](
      _0x752d0f["opening"]["job"]["budget"]["amount"],
      -0xce8 + -0x7 * 0x281 + 0x93 * 0x35
    )
  )
    _0xfa3242["sri"] = { percent: 0x0, frequency: 0x0 };
  else
    _0x252d2f["vAoXJ"](
      _0x752d0f["opening"]["job"]["budget"]["amount"],
      0x1699 + 0x20 * -0xa3 + -0x239
    ) &&
      (_0xfa3242["estimatedD" + "uration"] =
        _0x752d0f["opening"]["job"]["engagement" + "Duration"] ||
        _0x30f3a7["context"]["engagement" + "DurationsL" + "ist"][
          -0x3 * -0x66f + -0x7bd * 0x5 + -0x1367 * -0x1
        ]);
  if (_0x752d0f["questions"]["questions"]) {
    _0xfa3242["questions"] = [];
    for (const _0x35a65a of _0x752d0f["questions"]["questions"]) {
      _0xfa3242["questions"]["push"]({
        ..._0x35a65a,
        answer:
          "Let\x27s\x20disc" +
          "uss\x20detail" +
          "s\x20in\x20a\x20cal" +
          "l\x20or\x20chatt" +
          "ing",
      });
    }
  }
  return _0xfa3242;
}
async function apply(_0x4c9694, _0x339899) {
  const _0x264363 = {
    kOqHy: "applicatio" + "n/json,\x20te" + "xt/plain,\x20" + "*/*",
    KhMyb: "gzip,\x20defl" + "ate,\x20br",
    jDFZI: "en-US,en;q" + "=0.9",
    aSNSO: "empty",
    kdITJ: "same-origi" + "n",
    xlutW: "oDesk\x20LM",
    WoHXx: "XMLHttpReq" + "uest",
    ODZsw:
      "https://ww" +
      "w.upwork.c" +
      "om/ab/prop" +
      "osals/api/" +
      "v2/applica" +
      "tion/new",
    IhkZo: "applicatio" + "n/json",
    McBMk: "cors",
    nOPGa: "en-US",
  };
  AUTH = await getAuthData(_0x4c9694);
  {
    const _0x4a0124 =
        "https://ww" +
        "w.upwork.c" +
        "om/ab/prop" +
        "osals/api/" +
        "disinterme" +
        "diation/ap" +
        "ply",
      _0xd2e7a6 = {
        Accept: _0x264363["kOqHy"],
        "Accept-Encoding": _0x264363["KhMyb"],
        "Accept-Language": _0x264363["jDFZI"],
        Authorization: "Bearer\x20" + AUTH["oauth"],
        "Content-Type": "applicatio" + "n/json",
        "Sec-Fetch-Dest": _0x264363["aSNSO"],
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": _0x264363["kdITJ"],
        "x-odesk-csrf-token": AUTH["token"],
        "x-odesk-user-agent": _0x264363["xlutW"],
        "x-requested-with": _0x264363["WoHXx"],
        "X-Upwork-Accept-Language": "en-US",
      };
    await evaluate(_0x4c9694, _0x4a0124, _0xd2e7a6);
  }
  const _0x5d8e35 = _0x264363["ODZsw"],
    _0x452819 = {
      Accept: _0x264363["kOqHy"],
      "Accept-Encoding": _0x264363["KhMyb"],
      "Accept-Language": _0x264363["jDFZI"],
      Authorization: "Bearer\x20" + AUTH["oauth"],
      "Content-Type": _0x264363["IhkZo"],
      "Sec-Fetch-Dest": _0x264363["aSNSO"],
      "Sec-Fetch-Mode": _0x264363["McBMk"],
      "Sec-Fetch-Site": _0x264363["kdITJ"],
      "x-odesk-csrf-token": AUTH["token"],
      "x-odesk-user-agent": "oDesk\x20LM",
      "x-requested-with": "XMLHttpReq" + "uest",
      "X-Upwork-Accept-Language": _0x264363["nOPGa"],
    },
    _0x295d48 = await evaluate(_0x4c9694, _0x5d8e35, _0x452819, _0x339899);
  return console["log"](_0x295d48), _0x295d48;
}
(async () => {
  const _0x3185c4 = {
    fpLMA: function (_0x583411, _0x134935) {
      return _0x583411 + _0x134935;
    },
    cpVRw: "puppeteer_",
    tXJNC: "--start-ma" + "ximized",
    OMeri: function (_0x43c85f, _0x25f461) {
      return _0x43c85f == _0x25f461;
    },
    pcDIr: "false",
    iePsE: "Log\x20=>\x20HEA" + "DLESS:\x20",
    ukddi: "linux",
    RfgQS: "--no-sandb" + "ox",
    GDUXM:
      "https://ww" +
      "w.upwork.c" +
      "om/ab/acco" +
      "unt-securi" +
      "ty/login?r" +
      "edir=%2Fnx" +
      "%2Ffind-wo" +
      "rk%2Fmost-" +
      "recent",
    veLZs: function (_0x44bc6b, _0x2adeb6, _0x1a7bc8, _0x1afdbd) {
      return _0x44bc6b(_0x2adeb6, _0x1a7bc8, _0x1afdbd);
    },
    NTteD: "#login_use" + "rname",
    BMcjR: function (_0x375777, _0x36f17d) {
      return _0x375777(_0x36f17d);
    },
    tgSkt: "#login_pas" + "sword_cont" + "inue",
    QBvgW: function (_0x266d75, _0x43dc1f, _0x5cf5c0, _0x11008d) {
      return _0x266d75(_0x43dc1f, _0x5cf5c0, _0x11008d);
    },
    FxNbG: "#login_pas" + "sword",
    qLSiy: function (_0x5c14c9, _0x26011b) {
      return _0x5c14c9(_0x26011b);
    },
    IPFLS: "#login_con" + "trol_conti" + "nue",
    MQYix: "LOG:\x20",
    CyKIE: function (_0x1e62ed, _0x3f4d74) {
      return _0x1e62ed(_0x3f4d74);
    },
    cwHBf: function (_0x2474ea, _0x449154, _0x4f1c96) {
      return _0x2474ea(_0x449154, _0x4f1c96);
    },
    HlMWV: "[TITLE]\x20",
    gfaNb: "en-US",
    MLDyC: "Asia/Tokyo",
    xzIJV: function (_0x416070, _0x3507c2) {
      return _0x416070 !== _0x3507c2;
    },
    iZiVe: "===\x20go\x20awa" + "y\x20===",
    MTFiO: function (_0xd83336, _0x1356e5) {
      return _0xd83336(_0x1356e5);
    },
    lguyD: function (_0x35b2db, _0x178da0) {
      return _0x35b2db + _0x178da0;
    },
    UJUyT: function (_0x45a14b, _0x2edaad) {
      return _0x45a14b * _0x2edaad;
    },
    QqDzW: function (_0x361dc7, _0x1eb63b) {
      return _0x361dc7(_0x1eb63b);
    },
    NcUXH: "number",
    vYOGk: function (_0x37aab3, _0x466d79, _0x524403) {
      return _0x37aab3(_0x466d79, _0x524403);
    },
    aNePa:
      "=======\x20Ap" +
      "plied\x20job\x20" +
      "is\x20saved\x20s" +
      "uccessfull" +
      "y\x20=======",
    OfpjX: "sent",
    IRTfp:
      "=======\x20Ac" +
      "count\x20stat" +
      "us\x20was\x20upd" +
      "ated\x20=====" +
      "==",
    fkFYs: function (_0x32d3f1, _0x3ae85f, _0x5b86b4) {
      return _0x32d3f1(_0x3ae85f, _0x5b86b4);
    },
    bZPfY: "An\x20error\x20o" + "ccurred:\x20",
  };
  try {
    const { id: _0x1cf850, email: _0x1eef33 } = await getAvailableEmail();
    !_0x1eef33 && process["exit"](-0x1432 + -0x3b3 * -0x8 + -0x966);
    let _0x47bdab = _0x129210["join"](
        _0x50e8c8["tmpdir"](),
        _0x3185c4["fpLMA"](_0x3185c4["cpVRw"], Date["now"]()) +
          Math["random"]()
            ["toString"](-0x7 * 0xa6 + -0x276 + 0x724)
            ["substr"](
              0xa1f * 0x1 + -0x844 * 0x3 + 0x15 * 0xb3,
              -0x1dcf + -0xd * -0x232 + -0x2 * -0xa5
            )
      ),
      _0x230382 = {
        defaultViewport: null,
        userDataDir: _0x47bdab,
        args: [_0x3185c4["tXJNC"]],
      },
      _0x308a52 = process["env"]["HEADLESS"];
    _0x230382["headless"] = _0x308a52;
    if (_0x3185c4["OMeri"](_0x308a52, _0x3185c4["pcDIr"]))
      _0x230382["headless"] = ![];
    console["log"](_0x3185c4["iePsE"], _0x230382["headless"]);
    if (_0x3185c4["OMeri"](process["platform"], _0x3185c4["ukddi"]))
      _0x230382["args"]["push"](_0x3185c4["RfgQS"]);
    const _0x20d3a9 = await _0x60e4eb["launch"](_0x230382),
      _0x2bfa5c = await _0x20d3a9["newPage"]();
    await _0x2bfa5c["setDefault" + "Navigation" + "Timeout"](
      -0x889d + 0x1959c + 0x79a1
    ),
      await _0x2bfa5c["goto"](_0x3185c4["GDUXM"]),
      await _0x3185c4["veLZs"](input, _0x2bfa5c, _0x3185c4["NTteD"], _0x1eef33),
      await _0x3185c4["BMcjR"](click, {
        component: _0x2bfa5c,
        selector: _0x3185c4["tgSkt"],
      }),
      await wait(0x1 * -0x479 + 0x25f7 + -0x1d96),
      await _0x3185c4["QBvgW"](
        input,
        _0x2bfa5c,
        _0x3185c4["FxNbG"],
        process["env"]["PASSWORD"]
      ),
      await Promise["all"]([
        _0x2bfa5c["waitForNav" + "igation"](),
        _0x3185c4["qLSiy"](click, {
          component: _0x2bfa5c,
          selector: _0x3185c4["IPFLS"],
        }),
      ]),
      console["log"](_0x3185c4["MQYix"], "Logged\x20in"),
      (AUTH = await getAuthData(_0x2bfa5c));
    let _0x58de20 = "";
    console["log"](
      "==========" +
        "==========" +
        "\x20" +
        _0x1eef33 +
        ("\x20=========" + "=========")
    );
    while (!![]) {
      let {
        title: _0x282eb0,
        description: _0xce2c20,
        jobId: _0x38551b,
      } = await _0x3185c4["CyKIE"](getNewJob, _0x2bfa5c);
      (_0x38551b = await _0x3185c4["cwHBf"](filterJob, _0x2bfa5c, _0x38551b)),
        console["log"](_0x3185c4["HlMWV"], _0x282eb0),
        console["log"](
          new Date()["toLocaleSt" + "ring"](_0x3185c4["gfaNb"], {
            timeZone: _0x3185c4["MLDyC"],
          })
        );
      if (_0x3185c4["xzIJV"](_0x38551b, _0x3185c4["iZiVe"])) {
        const _0x53df2f = await _0x3185c4["BMcjR"](findJob, _0x38551b);
        if (!_0x53df2f && _0x38551b !== _0x58de20) {
          await _0x2bfa5c["goto"](
            "https://ww" +
              "w.upwork.c" +
              "om/ab/prop" +
              "osals/job/" +
              _0x38551b +
              "/apply/"
          ),
            await _0x3185c4["MTFiO"](
              wait,
              _0x3185c4["lguyD"](
                -0xa0f + 0x2 * 0xb + -0xde1 * -0x1,
                _0x3185c4["UJUyT"](
                  Math["random"](),
                  -0x1127 * -0x1 + 0xa43 + -0x1782
                )
              )
            ),
            (AUTH = await _0x3185c4["QqDzW"](getAuthData, _0x2bfa5c));
          const _0x5dc84f = await getJobDetail(_0x2bfa5c, _0x38551b),
            _0xf354fb = await apply(_0x2bfa5c, _0x5dc84f);
          if (typeof _0xf354fb !== _0x3185c4["NcUXH"]) {
            await _0x3185c4["vYOGk"](saveJob, _0x1eef33, {
              title: _0x282eb0,
              description: _0xce2c20,
              link: _0x38551b,
              connect: 0x0,
            }),
              console["log"](_0x3185c4["aNePa"]),
              await _0x3185c4["cwHBf"](
                updateStatus,
                _0x1cf850,
                _0x3185c4["OfpjX"]
              ),
              console["log"](_0x3185c4["IRTfp"]);
            break;
          } else {
            await _0x3185c4["CyKIE"](removeAccount, _0x1cf850),
              await _0x3185c4["fkFYs"](saveJob, _0x1eef33, {
                title: _0x282eb0,
                description: _0xce2c20,
                link: _0x38551b,
                connect: 0x3e8,
              });
            break;
          }
        }
      }
      await wait(0x12ba + -0x10e1 + 0x20f);
    }
    _0x20d3a9["close"](),
      process["exit"](0x1049 * 0x1 + 0x1 * -0x2261 + 0x8 * 0x243);
  } catch (_0x45c6ba) {
    console["log"](_0x3185c4["bZPfY"], _0x45c6ba),
      process["exit"](-0x15fc + 0x2085 * 0x1 + -0xa89);
  }
})();
