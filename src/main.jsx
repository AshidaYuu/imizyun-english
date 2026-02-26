import React, { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

        const createQuestionSortQuestion = ({
            id,
            original,
            translation,
            qLeadJp,
            qWhoJp,
            qDoesJp,
            qWhatJp,
            qWhereJp,
            qHowJp,
            qWhenJp,
            qLeadEn,
            qWhoEn,
            qDoesEn,
            qWhatEn,
            qWhereEn,
            qHowEn,
            qWhenEn,
            aWhoJp,
            aDoesJp,
            aWhoEn,
            aDoesEn,
            aWhatJp,
            aWhereJp,
            aHowJp,
            aWhenJp,
            aWhatEn,
            aWhereEn,
            aHowEn,
            aWhenEn
        }) => {
            const splitYesNo = (text = "") => {
                const raw = String(text || "").trim();
                if (!raw) return { yes: "", no: "" };
                const normalized = raw.replace(/／/g, "/");
                let parts = [];
                if (normalized.includes("/")) {
                    parts = normalized.split("/").map(s => s.trim()).filter(Boolean);
                } else if (normalized.includes("・")) {
                    parts = normalized.split("・").map(s => s.trim()).filter(Boolean);
                }
                if (parts.length >= 2) {
                    return { yes: parts[0], no: parts[1] };
                }
                return { yes: raw, no: "" };
            };

            const withValue = (jp, en) => {
                const hasJp = typeof jp === "string" && jp.trim() !== "";
                const hasEn = typeof en === "string" && en.trim() !== "";
                if (!hasJp && !hasEn) return null;
                const normalizeEn = (value) => (
                    String(value || "").trim().toLowerCase() === "(blank)" ? "空欄" : value
                );
                return { jp: hasJp ? jp : "", en: hasEn ? normalizeEn(en) : "" };
            };

            const jpAnswer = splitYesNo(aDoesJp);
            const enAnswer = splitYesNo(aDoesEn);

            const rows = [
                {
                    id: `q-${id}`,
                    labels: {
                        lead: "しますか？/ですか？",
                        who: "だれが",
                        does: "する・です",
                        what: "だれ・なに",
                        where: "どこ",
                        how: "状態(状)",
                        when: "いつ"
                    },
                    structure: {
                        lead: withValue(qLeadJp, qLeadEn),
                        who: withValue(qWhoJp, qWhoEn),
                        does: withValue(qDoesJp, qDoesEn),
                        what: withValue(qWhatJp, qWhatEn),
                        where: withValue(qWhereJp, qWhereEn),
                        how: withValue(qHowJp, qHowEn),
                        when: withValue(qWhenJp, qWhenEn)
                    }
                },
            ];

            if (jpAnswer.yes || enAnswer.yes) {
                rows.push({
                    id: `a-yes-${id}`,
                    labels: {
                        lead: "はい・いいえ",
                        who: "だれが",
                        does: "する・です",
                        what: "だれ・なに",
                        where: "どこ",
                        how: "状態(状)",
                        when: "いつ"
                    },
                    structure: {
                        lead: { jp: "はい", en: "Yes" },
                        who: withValue(aWhoJp, aWhoEn),
                        does: withValue(jpAnswer.yes, enAnswer.yes),
                        what: withValue(aWhatJp, aWhatEn),
                        where: withValue(aWhereJp, aWhereEn),
                        how: withValue(aHowJp, aHowEn),
                        when: withValue(aWhenJp, aWhenEn)
                    }
                });
            }

            if (jpAnswer.no || enAnswer.no) {
                rows.push({
                    id: `a-no-${id}`,
                    labels: {
                        lead: "はい・いいえ",
                        who: "だれが",
                        does: "する・です",
                        what: "だれ・なに",
                        where: "どこ",
                        how: "状態(状)",
                        when: "いつ"
                    },
                    structure: {
                        lead: { jp: "いいえ", en: "No" },
                        who: withValue(aWhoJp, aWhoEn),
                        does: withValue(jpAnswer.no, enAnswer.no),
                        what: withValue(aWhatJp, aWhatEn),
                        where: withValue(aWhereJp, aWhereEn),
                        how: withValue(aHowJp, aHowEn),
                        when: withValue(aWhenJp, aWhenEn)
                    }
                });
            }

            const keys = ["lead", "who", "does", "what", "where", "how", "when"];
            const jpOptions = [];
            const enOptions = [];
            let optionIndex = 0;

            rows.forEach(row => {
                keys.forEach(key => {
                    const part = row.structure[key];
                    if (!part) return;
                    optionIndex += 1;
                    jpOptions.push({ id: `j${id}-${optionIndex}`, text: part.jp, category: key });
                    enOptions.push({ id: `e${id}-${optionIndex}`, text: part.en, category: key });
                });
            });

            return { id, original, translation, rows, jpOptions, enOptions };
        };

        // ========== COURSE DATA ==========
        const COURSES = [
            {
                id: 2024022301,
                title: "英語語順トレーニング",
                updatedAt: new Date().toISOString(),
                japaneseOnly: true,
                flashcards: [
                    { id: 1, front: "日本語と英語の大きな違いは？", back: "語順が違う", hint: "英語は並べる順番がとても重要です" },
                    { id: 2, front: "英語は語順を変えるとどうなる？", back: "意味が通じなくなる", hint: "順番に意味があるためです" },
                    { id: 3, front: "英語の語順は何種類ある？", back: "2種類「です文」と「する文」", hint: "動詞の種類によって分かれます" },
                    { id: 4, front: "英語の語順の1種類目は？", back: "「です文」：だれが → です → 〜(ニョロ) → 所 → 状 → 時", hint: "be動詞(〜です)を使う文です" },
                    { id: 5, front: "英語の語順の2種類目は？", back: "「する文」：だれが → する → だれ・なに → 所 → 状 → 時", hint: "一般動詞(〜する)を使う文です" }
                ],
                questions: [
                    {
                        id: 1, original: "ケンがボールを蹴った", translation: "N/A", hint: "だれが → する → なに",
                        rows: [{ id: 'main', structure: { who: { jp: "ケンが", en: "N/A" }, does: { jp: "蹴った", en: "N/A" }, what: { jp: "ボールを", en: "N/A" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "ケンが", category: 'who' }, { id: 'j2', text: "蹴った", category: 'does' }, { id: 'j3', text: "ボールを", category: 'what' }],
                        enOptions: []
                    },
                    {
                        id: 2, original: "私は加藤です", translation: "N/A", hint: "だれが → です → 〜(ニョロ)",
                        rows: [{ id: 'main', structure: { who: { jp: "私は", en: "N/A" }, does: { jp: "です", en: "N/A" }, what: { jp: "加藤", en: "N/A" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "加藤", category: 'what' }],
                        enOptions: []
                    },
                    {
                        id: 3, original: "彼は今日学校に行く", translation: "N/A", hint: "だれが → する → 所 → 時",
                        rows: [{ id: 'main', structure: { who: { jp: "彼は", en: "N/A" }, does: { jp: "行く", en: "N/A" }, what: null, where: { jp: "学校に", en: "N/A" }, how: null, when: { jp: "今日", en: "N/A" } } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "行く", category: 'does' }, { id: 'j3', text: "学校に", category: 'where' }, { id: 'j4', text: "今日", category: 'when' }],
                        enOptions: []
                    },
                    {
                        id: 4, original: "先生がみんなに話した", translation: "N/A", hint: "だれが → する → だれ(に)",
                        rows: [{ id: 'main', structure: { who: { jp: "先生が", en: "N/A" }, does: { jp: "話した", en: "N/A" }, what: { jp: "みんなに", en: "N/A" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "先生が", category: 'who' }, { id: 'j2', text: "話した", category: 'does' }, { id: 'j3', text: "みんなに", category: 'what' }],
                        enOptions: []
                    },
                    {
                        id: 5, original: "彼女は毎朝家で勉強する", translation: "N/A", hint: "だれが → する → 所 → 時",
                        rows: [{ id: 'main', structure: { who: { jp: "彼女は", en: "N/A" }, does: { jp: "勉強する", en: "N/A" }, what: null, where: { jp: "家で", en: "N/A" }, how: null, when: { jp: "毎朝", en: "N/A" } } }],
                        jpOptions: [{ id: 'j1', text: "彼女は", category: 'who' }, { id: 'j2', text: "勉強する", category: 'does' }, { id: 'j3', text: "家で", category: 'where' }, { id: 'j4', text: "毎朝", category: 'when' }],
                        enOptions: []
                    },
                    {
                        id: 6, original: "子どもが公園で遊んでいる", translation: "N/A", hint: "だれが → する → 所",
                        rows: [{ id: 'main', structure: { who: { jp: "子どもが", en: "N/A" }, does: { jp: "遊んでいる", en: "N/A" }, what: null, where: { jp: "公園で", en: "N/A" }, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "子どもが", category: 'who' }, { id: 'j2', text: "遊んでいる", category: 'does' }, { id: 'j3', text: "公園で", category: 'where' }],
                        enOptions: []
                    },
                    {
                        id: 7, original: "彼は元気です", translation: "N/A", hint: "だれが → です → 〜(ニョロ)",
                        rows: [{ id: 'main', structure: { who: { jp: "彼は", en: "N/A" }, does: { jp: "です", en: "N/A" }, what: { jp: "元気", en: "N/A" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "元気", category: 'what' }],
                        enOptions: []
                    },
                    {
                        id: 8, original: "ケンがゆっくりボールを蹴った", translation: "N/A", hint: "だれが → する → なに → 状",
                        rows: [{ id: 'main', structure: { who: { jp: "ケンが", en: "N/A" }, does: { jp: "蹴った", en: "N/A" }, what: { jp: "ボールを", en: "N/A" }, where: null, how: { jp: "ゆっくり", en: "N/A" }, when: null } }],
                        jpOptions: [{ id: 'j1', text: "ケンが", category: 'who' }, { id: 'j2', text: "蹴った", category: 'does' }, { id: 'j3', text: "ボールを", category: 'what' }, { id: 'j4', text: "ゆっくり", category: 'how' }],
                        enOptions: []
                    },
                    {
                        id: 9, original: "宇宙人が教室でこっそり昨日、給食を食べた", translation: "N/A", hint: "だれが → する → なに → 所 → 状 → 時",
                        rows: [{ id: 'main', structure: { who: { jp: "宇宙人が", en: "N/A" }, does: { jp: "食べた", en: "N/A" }, what: { jp: "給食を", en: "N/A" }, where: { jp: "教室で", en: "N/A" }, how: { jp: "こっそり", en: "N/A" }, when: { jp: "昨日、", en: "N/A" } } }],
                        jpOptions: [{ id: 'j1', text: "宇宙人が", category: 'who' }, { id: 'j2', text: "食べた", category: 'does' }, { id: 'j3', text: "給食を", category: 'what' }, { id: 'j4', text: "教室で", category: 'where' }, { id: 'j5', text: "こっそり", category: 'how' }, { id: 'j6', text: "昨日、", category: 'when' }],
                        enOptions: []
                    },
                    {
                        id: 10, original: "ぼくは休み時間に廊下で全力で、消しゴムを投げる", translation: "N/A", hint: "だれが → する → なに → 所 → 状 → 時",
                        rows: [{ id: 'main', structure: { who: { jp: "ぼくは", en: "N/A" }, does: { jp: "投げる", en: "N/A" }, what: { jp: "消しゴムを", en: "N/A" }, where: { jp: "廊下で", en: "N/A" }, how: { jp: "全力で、", en: "N/A" }, when: { jp: "休み時間に", en: "N/A" } } }],
                        jpOptions: [{ id: 'j1', text: "ぼくは", category: 'who' }, { id: 'j2', text: "投げる", category: 'does' }, { id: 'j3', text: "消しゴムを", category: 'what' }, { id: 'j4', text: "廊下で", category: 'where' }, { id: 'j5', text: "全力で、", category: 'how' }, { id: 'j6', text: "休み時間に", category: 'when' }],
                        enOptions: []
                    },
                    {
                        id: 11, original: "ねこが夜に家でどや顔で、リモコンを押した", translation: "N/A", hint: "だれが → する → なに → 所 → 状 → 時",
                        rows: [{ id: 'main', structure: { who: { jp: "ねこが", en: "N/A" }, does: { jp: "押した", en: "N/A" }, what: { jp: "リモコンを", en: "N/A" }, where: { jp: "家で", en: "N/A" }, how: { jp: "どや顔で、", en: "N/A" }, when: { jp: "夜に", en: "N/A" } } }],
                        jpOptions: [{ id: 'j1', text: "ねこが", category: 'who' }, { id: 'j2', text: "押した", category: 'does' }, { id: 'j3', text: "リモコンを", category: 'what' }, { id: 'j4', text: "家で", category: 'where' }, { id: 'j5', text: "どや顔で、", category: 'how' }, { id: 'j6', text: "夜に", category: 'when' }],
                        enOptions: []
                    },
                    {
                        id: 12, original: "ぼくはさっき机の下でびくびく、0点のテストを見つけた", translation: "N/A", hint: "だれが → する → なに → 所 → 状 → 時",
                        rows: [{ id: 'main', structure: { who: { jp: "ぼくは", en: "N/A" }, does: { jp: "見つけた", en: "N/A" }, what: { jp: "0点のテストを", en: "N/A" }, where: { jp: "机の下で", en: "N/A" }, how: { jp: "びくびく、", en: "N/A" }, when: { jp: "さっき", en: "N/A" } } }],
                        jpOptions: [{ id: 'j1', text: "ぼくは", category: 'who' }, { id: 'j2', text: "見つけた", category: 'does' }, { id: 'j3', text: "0点のテストを", category: 'what' }, { id: 'j4', text: "机の下で", category: 'where' }, { id: 'j5', text: "びくびく、", category: 'how' }, { id: 'j6', text: "さっき", category: 'when' }],
                        enOptions: []
                    },
                    {
                        id: 13, original: "友だちが昼に体育館で大声で、アニメの歌を歌った", translation: "N/A", hint: "だれが → する → なに → 所 → 状 → 時",
                        rows: [{ id: 'main', structure: { who: { jp: "友だちが", en: "N/A" }, does: { jp: "歌った", en: "N/A" }, what: { jp: "アニメの歌を", en: "N/A" }, where: { jp: "体育館で", en: "N/A" }, how: { jp: "大声で、", en: "N/A" }, when: { jp: "昼に", en: "N/A" } } }],
                        jpOptions: [{ id: 'j1', text: "友だちが", category: 'who' }, { id: 'j2', text: "歌った", category: 'does' }, { id: 'j3', text: "アニメの歌を", category: 'what' }, { id: 'j4', text: "体育館で", category: 'where' }, { id: 'j5', text: "大声で、", category: 'how' }, { id: 'j6', text: "昼に", category: 'when' }],
                        enOptions: []
                    },
                    {
                        id: 14, original: "お母さんが毎日台所でにこにこ、プリンを作る", translation: "N/A", hint: "だれが → する → なに → 所 → 状 → 時",
                        rows: [{ id: 'main', structure: { who: { jp: "お母さんが", en: "N/A" }, does: { jp: "作る", en: "N/A" }, what: { jp: "プリンを", en: "N/A" }, where: { jp: "台所で", en: "N/A" }, how: { jp: "にこにこ、", en: "N/A" }, when: { jp: "毎日", en: "N/A" } } }],
                        jpOptions: [{ id: 'j1', text: "お母さんが", category: 'who' }, { id: 'j2', text: "作る", category: 'does' }, { id: 'j3', text: "プリンを", category: 'what' }, { id: 'j4', text: "台所で", category: 'where' }, { id: 'j5', text: "にこにこ、", category: 'how' }, { id: 'j6', text: "毎日", category: 'when' }],
                        enOptions: []
                    }
                ]
            },
            {
                id: 2024011601,
                title: "中1英語・第8講「英語の語順のルール」",
                flashcards: [
                    { id: 1, front: "英語と日本語の最大の違いは？", back: "「語順（言葉を並べる順番）」が違う！", hint: "単語だけ覚えても通じない理由です" },
                    { id: 2, front: "英語の基本文型（語順）は？", back: "誰が → どうする → 何を\n(Subject → Verb → Object)", hint: "日本語は「誰が→何を→どうする」ですが…" },
                    { id: 3, front: "「私はテニスをします」を英語の語順にすると？", back: "私は → します → テニスを\n(I play tennis.)", hint: "結論（動作）を先に言います" },
                    { id: 4, front: "「場所」と「時」を並べるとき、どっちが先？", back: "「場所」→「時」の順番\n(例：in the park on Sunday)", hint: "小さい単位（場所）から大きい単位（時）へ" },
                    { id: 5, front: "日本語は「最後まで聞かないとわからない」言語。英語は？", back: "「最初に結論（誰がどうする）を言う」言語", hint: "だから英語は主語のすぐ後に動詞が来ます" }
                ],
                questions: [
                    {
                        id: 1, original: "私は毎日テニスをします。", translation: "I play tennis every day.", hint: "「誰が→どうする→何を→いつ」の順番で並べましょう。",
                        rows: [{ id: 'main', structure: { who: { jp: "私は", en: "I" }, does: { jp: "します", en: "play" }, what: { jp: "テニスを", en: "tennis" }, when: { jp: "毎日", en: "every day" }, where: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "します", category: 'does' }, { id: 'j3', text: "テニスを", category: 'what' }, { id: 'j4', text: "毎日", category: 'when' }, { id: 'j5', text: "公園で", category: 'dummy' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "play", category: 'does' }, { id: 'e3', text: "tennis", category: 'what' }, { id: 'e4', text: "every day", category: 'when' }, { id: 'e5', text: "plays", category: 'dummy' }]
                    },
                    {
                        id: 2, original: "私は英語が好きです。", translation: "I like English.", hint: "「好き」も英語では動作（どうする）の位置に置きます。",
                        rows: [{ id: 'main', structure: { who: { jp: "私は", en: "I" }, does: { jp: "好きです", en: "like" }, what: { jp: "英語が", en: "English" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "好きです", category: 'does' }, { id: 'j3', text: "英語が", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "like", category: 'does' }, { id: 'e3', text: "English", category: 'what' }]
                    },
                    {
                        id: 3, original: "私は日曜日、公園でテニスをします。", translation: "I play tennis in the park on Sunday.", hint: "場所（公園で）と 時（日曜日）の語順に注意！「場所 → 時」です。",
                        rows: [{ id: 'main', structure: { who: { jp: "私は", en: "I" }, does: { jp: "します", en: "play" }, what: { jp: "テニスを", en: "tennis" }, where: { jp: "公園で", en: "in the park" }, when: { jp: "日曜日に", en: "on Sunday" } } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "します", category: 'does' }, { id: 'j3', text: "テニスを", category: 'what' }, { id: 'j4', text: "公園で", category: 'where' }, { id: 'j5', text: "日曜日に", category: 'when' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "play", category: 'does' }, { id: 'e3', text: "tennis", category: 'what' }, { id: 'e4', text: "in the park", category: 'where' }, { id: 'e5', text: "on Sunday", category: 'when' }]
                    }
                ]
            },
            {
                id: 2024011701,
                title: "中学英語【１年】 第９講 『a/anとtheの使い方』",
                flashcards: [
                    { id: 1, front: "「a / an」と「the」の大きな違いは？", back: "a/an = たくさんある中の「とある１つ」（不特定）\nthe = 「その」「例の」と指させるもの（特定）", hint: "「どれでもいい１つ」か「それ！」と決まっているか" },
                    { id: 2, front: "「a」と「an」の使い分けは？", back: "後ろの単語の発音が\n「母音(a,i,u,e,o)」で始まるときは an\nそれ以外は a", hint: "スペルではなく「発音」で判断します（例: an hour）" },
                    { id: 3, front: "「楽器」を演奏するとき、冠詞（a/the）はつく？", back: "楽器には「the」をつける\n(例: play the piano)", hint: "楽器は「その楽器」と特定して演奏するイメージ" },
                    { id: 4, front: "「スポーツ」をするとき、冠詞（a/the）はつく？", back: "スポーツには「何もつかない」\n(例: play soccer)", hint: "スポーツは世界共通のルール（概念）なので特定しません" },
                    { id: 5, front: "「昼食を食べる」と言うとき、冠詞は？", back: "食事（breakfast, lunch, dinner）には何もつかない\n(例: eat lunch)", hint: "習慣的な食事には冠詞は不要です" }
                ],
                questions: [
                    {
                        id: 1, original: "私はペンを持っています。", translation: "I have a pen.", hint: "特定されていない「とある1本のペン」なので a を使います。",
                        rows: [{ id: 'main', structure: { who: { jp: "私は", en: "I" }, does: { jp: "持っています", en: "have" }, what: { jp: "ペンを", en: "a pen" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "持っています", category: 'does' }, { id: 'j3', text: "ペンを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "have", category: 'does' }, { id: 'e3', text: "a pen", category: 'what' }, { id: 'e4', text: "the pen", category: 'dummy' }]
                    },
                    {
                        id: 2, original: "彼女はピアノを弾きます。", translation: "She plays the piano.", hint: "楽器（piano）の前には the が必要です。",
                        rows: [{ id: 'main', structure: { who: { jp: "彼女は", en: "She" }, does: { jp: "弾きます", en: "plays" }, what: { jp: "ピアノを", en: "the piano" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼女は", category: 'who' }, { id: 'j2', text: "弾きます", category: 'does' }, { id: 'j3', text: "ピアノを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "She", category: 'who' }, { id: 'e2', text: "plays", category: 'does' }, { id: 'e3', text: "the piano", category: 'what' }, { id: 'e4', text: "piano", category: 'dummy' }]
                    },
                    {
                        id: 3, original: "これは卵です。", translation: "This is an egg.", hint: "egg は母音(e)で始まるので、a ではなく an を使います。",
                        rows: [{ id: 'main', structure: { who: { jp: "これは", en: "This" }, does: { jp: "です(=)", en: "is" }, what: { jp: "卵", en: "an egg" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "これは", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "卵", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "This", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "an egg", category: 'what' }, { id: 'e4', text: "a egg", category: 'dummy' }]
                    }
                ]
            },
            {
                id: 2024011702,
                title: "中学英語【１年】 第10講 『所有格と形容詞』",
                flashcards: [
                    { id: 1, front: "「私の」「あなたの」のような言葉を何と言う？", back: "所有格 (Possessive)\nmy, your, his, her など", hint: "「誰のもの」かを表す言葉です" },
                    { id: 2, front: "「大きい」や「赤い」のような言葉を何と言う？", back: "形容詞 (Adjective)\n名詞の性質や状態を説明します", hint: "big, red, new, tall など" },
                    { id: 3, front: "形容詞を置く場所①：名詞を詳しくするとき", back: "名詞の「前」に置く\n例: a big dog", hint: "日本語と同じ語順です（大きい犬）" },
                    { id: 4, front: "形容詞を置く場所②：主語を説明するとき", back: "be動詞の「後ろ」に置く\n例: The dog is big.", hint: "S = C の関係（その犬＝大きい）" },
                    { id: 5, front: "「彼」と「彼の」の使い分けは？", back: "彼は = He (主語)\n彼の = His (所有格)", hint: "言葉の役割によって形が変わります" }
                ],
                questions: [
                    {
                        id: 1, original: "これは私のペンです。", translation: "This is my pen.", hint: "「私の(my)」は名詞(pen)の前に置きます。",
                        rows: [{ id: 'main', structure: { who: { jp: "これは", en: "This" }, does: { jp: "です", en: "is" }, what: { jp: "私のペン", en: "my pen" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "これは", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "私のペン", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "This", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "my pen", category: 'what' }, { id: 'e4', text: "I pen", category: 'dummy' }]
                    },
                    {
                        id: 2, original: "彼は背が高い。", translation: "He is tall.", hint: "be動詞の後ろに形容詞(tall)を置くと「～は背が高いです」となります。",
                        rows: [{ id: 'main', structure: { who: { jp: "彼は", en: "He" }, does: { jp: "です(=)", en: "is" }, what: { jp: "背が高い", en: "tall" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "背が高い", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "He", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "tall", category: 'what' }, { id: 'e4', text: "toll", category: 'dummy' }]
                    },
                    {
                        id: 3, original: "彼女の猫は可愛いです。", translation: "Her cat is cute.", hint: "主語は「彼女」ではなく「彼女の猫」です。",
                        rows: [{ id: 'main', structure: { who: { jp: "彼女の猫は", en: "Her cat" }, does: { jp: "です(=)", en: "is" }, what: { jp: "可愛い", en: "cute" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼女の猫は", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "可愛い", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "Her cat", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "cute", category: 'what' }, { id: 'e4', text: "She cat", category: 'dummy' }]
                    }
                ]
            },
            {
                id: 2024011703,
                title: "中学英語【１年】 第11講 『名詞の複数形』",
                flashcards: [
                    { id: 1, front: "「複数形」を作る基本のルールは？", back: "名詞の最後に「s」をつける\n例: apple → apples", hint: "もっとも一般的な形です" },
                    { id: 2, front: "「es」をつけるのはどんな時？", back: "語尾が s, sh, ch, x, o のとき\n例: box → boxes", hint: "発音しやすくするためです" },
                    { id: 3, front: "「子音 + y」で終わる単語のルールは？", back: "y を i に変えて es\n例: city → cities", hint: "母音(a,i,u,e,o) + y の場合（play→plays）はそのままでOK" },
                    { id: 4, front: "不規則な変化をする名詞の例（男の人）", back: "man → men\n（woman → women）", hint: "sはつきません。中の母音が変わります" },
                    { id: 5, front: "不規則な変化をする名詞の例（子供）", back: "child → children", hint: "これは丸暗記が必要です" }
                ],
                questions: [
                    {
                        id: 1, original: "私は２本のペンを持っています。", translation: "I have two pens.", hint: "2本なので pen を複数形にします。",
                        rows: [{ id: 'main', structure: { who: { jp: "私は", en: "I" }, does: { jp: "持っています", en: "have" }, what: { jp: "2本のペンを", en: "two pens" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "持っています", category: 'does' }, { id: 'j3', text: "2本のペンを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "have", category: 'does' }, { id: 'e3', text: "two pens", category: 'what' }, { id: 'e4', text: "two pen", category: 'dummy' }]
                    },
                    {
                        id: 2, original: "彼らは学生です。", translation: "They are students.", hint: "主語が複数なら、補語(students)も複数形になります。",
                        rows: [{ id: 'main', structure: { who: { jp: "彼らは", en: "They" }, does: { jp: "です(=)", en: "are" }, what: { jp: "学生", en: "students" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼らは", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "学生", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "They", category: 'who' }, { id: 'e2', text: "are", category: 'does' }, { id: 'e3', text: "students", category: 'what' }, { id: 'e4', text: "student", category: 'dummy' }]
                    },
                    {
                        id: 3, original: "彼は３つの箱を持っています。", translation: "He has three boxes.", hint: "box は x で終わるので es をつけます。",
                        rows: [{ id: 'main', structure: { who: { jp: "彼は", en: "He" }, does: { jp: "持っています", en: "has" }, what: { jp: "３つの箱を", en: "three boxes" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "持っています", category: 'does' }, { id: 'j3', text: "３つの箱を", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "He", category: 'who' }, { id: 'e2', text: "has", category: 'does' }, { id: 'e3', text: "three boxes", category: 'what' }, { id: 'e4', text: "three boxs", category: 'dummy' }]
                    }
                ]
            },
            {
                id: 101, // PDF 1
                title: "中1英語・be動詞（PDF完全準拠）",
                description: "PDF『1.be動詞』の全15問。5ステップ学習対応版。",
                flashcards: [
                    { id: 1, front: "I am a student.", back: "私は学生です。", hint: "be動詞: am" },
                    { id: 2, front: "You are Tom.", back: "あなたはトムです。", hint: "be動詞: are" },
                    { id: 3, front: "He is busy.", back: "彼は忙しい。", hint: "be動詞: is" },
                    { id: 4, front: "It is an apple.", back: "それはリンゴです。", hint: "an apple (母音の前)" },
                    { id: 5, front: "She is kind.", back: "彼女は親切だ。", hint: "kind: 親切な" },
                    { id: 6, front: "This is a pen.", back: "これはペンです。", hint: "This: これ" },
                    { id: 7, front: "The dog is Bob.", back: "その犬はボブです。", hint: "The dog = It扱い" },
                    { id: 8, front: "We are doctors.", back: "私たちは医者です。", hint: "複数形 doctors" },
                    { id: 9, front: "You are teachers.", back: "あなたたちは先生です。", hint: "複数形 teachers" },
                    { id: 10, front: "They are friends.", back: "彼らは友達です。", hint: "複数形 friends" },
                    { id: 11, front: "This is Akira.", back: "こちらはアキラです。", hint: "人の紹介も This is" },
                    { id: 12, front: "That is a book.", back: "あれは本です。", hint: "That: あれ" },
                    { id: 13, front: "I am from Japan.", back: "私は日本出身です。", hint: "be from: ～出身" },
                    { id: 14, front: "I am Suzuki Ken.", back: "私はスズキケンです。", hint: "名前を言う" },
                    { id: 15, front: "They are students.", back: "彼らは学生です。", hint: "複数形 students" }
                ],
                questions: [
                    {
                        id: 1, original: "私は学生です。", translation: "I am a student.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "です(=)", en: "am" }, what: { jp: "学生", en: "a student" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "学生", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "am", category: 'does' }, { id: 'e3', text: "a student", category: 'what' }, { id: 'e4', text: "are", category: 'dummy' }]
                    },
                    {
                        id: 2, original: "あなたはトムです。", translation: "You are Tom.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あなたは", en: "You" }, does: { jp: "です(=)", en: "are" }, what: { jp: "トム", en: "Tom" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あなたは", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "トム", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "You", category: 'who' }, { id: 'e2', text: "are", category: 'does' }, { id: 'e3', text: "Tom", category: 'what' }, { id: 'e4', text: "is", category: 'dummy' }]
                    },
                    {
                        id: 3, original: "彼は忙しい。", translation: "He is busy.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼は", en: "He" }, does: { jp: "です(=)", en: "is" }, what: { jp: "忙しい", en: "busy" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "忙しい", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "He", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "busy", category: 'what' }, { id: 'e4', text: "am", category: 'dummy' }]
                    },
                    {
                        id: 4, original: "それはリンゴです。", translation: "It is an apple.",
                        rows: [{ id: 'm1', structure: { who: { jp: "それは", en: "It" }, does: { jp: "です(=)", en: "is" }, what: { jp: "リンゴ", en: "an apple" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "それは", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "リンゴ", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "It", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "an apple", category: 'what' }, { id: 'e4', text: "a apple", category: 'dummy' }]
                    },
                    {
                        id: 5, original: "彼女は親切だ。", translation: "She is kind.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼女は", en: "She" }, does: { jp: "です(=)", en: "is" }, what: { jp: "親切だ", en: "kind" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼女は", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "親切だ", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "She", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "kind", category: 'what' }, { id: 'e4', text: "kinds", category: 'dummy' }]
                    },
                    {
                        id: 6, original: "これはペンです。", translation: "This is a pen.",
                        rows: [{ id: 'm1', structure: { who: { jp: "これは", en: "This" }, does: { jp: "です(=)", en: "is" }, what: { jp: "ペン", en: "a pen" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "これは", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "ペン", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "This", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "a pen", category: 'what' }, { id: 'e4', text: "pen", category: 'dummy' }]
                    },
                    {
                        id: 7, original: "その犬はボブです。", translation: "The dog is Bob.",
                        rows: [{ id: 'm1', structure: { who: { jp: "その犬は", en: "The dog" }, does: { jp: "です(=)", en: "is" }, what: { jp: "ボブ", en: "Bob" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "その犬は", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "ボブ", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "The dog", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "Bob", category: 'what' }, { id: 'e4', text: "are", category: 'dummy' }]
                    },
                    {
                        id: 8, original: "私たちは医者です。", translation: "We are doctors.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私たちは", en: "We" }, does: { jp: "です(=)", en: "are" }, what: { jp: "医者", en: "doctors" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私たちは", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "医者", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "We", category: 'who' }, { id: 'e2', text: "are", category: 'does' }, { id: 'e3', text: "doctors", category: 'what' }, { id: 'e4', text: "doctor", category: 'dummy' }]
                    },
                    {
                        id: 9, original: "あなたたちは先生です。", translation: "You are teachers.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あなたたちは", en: "You" }, does: { jp: "です(=)", en: "are" }, what: { jp: "先生", en: "teachers" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あなたたちは", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "先生", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "You", category: 'who' }, { id: 'e2', text: "are", category: 'does' }, { id: 'e3', text: "teachers", category: 'what' }, { id: 'e4', text: "teacher", category: 'dummy' }]
                    },
                    {
                        id: 10, original: "彼らは友達です。", translation: "They are friends.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼らは", en: "They" }, does: { jp: "です(=)", en: "are" }, what: { jp: "友達", en: "friends" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼らは", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "友達", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "They", category: 'who' }, { id: 'e2', text: "are", category: 'does' }, { id: 'e3', text: "friends", category: 'what' }, { id: 'e4', text: "friend", category: 'dummy' }]
                    },
                    {
                        id: 11, original: "こちらはアキラです。", translation: "This is Akira.",
                        rows: [{ id: 'm1', structure: { who: { jp: "こちらは", en: "This" }, does: { jp: "です(=)", en: "is" }, what: { jp: "アキラ", en: "Akira" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "こちらは", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "アキラ", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "This", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "Akira", category: 'what' }, { id: 'e4', text: "He", category: 'dummy' }]
                    },
                    {
                        id: 12, original: "あれは本です。", translation: "That is a book.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あれは", en: "That" }, does: { jp: "です(=)", en: "is" }, what: { jp: "本", en: "a book" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あれは", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "本", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "That", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "a book", category: 'what' }, { id: 'e4', text: "pen", category: 'dummy' }]
                    },
                    {
                        id: 13, original: "私は日本出身です。", translation: "I am from Japan.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "です(=)", en: "am" }, what: { jp: "日本出身", en: "from Japan" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "日本出身", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "am", category: 'does' }, { id: 'e3', text: "from Japan", category: 'what' }, { id: 'e4', text: "Japan", category: 'dummy' }]
                    },
                    {
                        id: 14, original: "私はスズキケンです。", translation: "I am Suzuki Ken.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "です(=)", en: "am" }, what: { jp: "スズキケン", en: "Suzuki Ken" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "スズキケン", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "am", category: 'does' }, { id: 'e3', text: "Suzuki Ken", category: 'what' }, { id: 'e4', text: "Suzuki", category: 'dummy' }]
                    },
                    {
                        id: 15, original: "彼らは学生です。", translation: "They are students.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼らは", en: "They" }, does: { jp: "です(=)", en: "are" }, what: { jp: "学生", en: "students" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼らは", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "学生", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "They", category: 'who' }, { id: 'e2', text: "are", category: 'does' }, { id: 'e3', text: "students", category: 'what' }, { id: 'e4', text: "student", category: 'dummy' }]
                    }
                ]
            },
            {
                id: 102,
                title: "中1英語・一般動詞（PDF完全準拠）",
                description: "PDF『2.一般動詞』の全15問。5ステップ学習対応版。",
                flashcards: [
                    { id: 1, front: "I play tennis.", back: "私はテニスをします。", hint: "play = する" },
                    { id: 2, front: "You like coffee.", back: "あなたはコーヒーが好きです。", hint: "like = 好き" },
                    { id: 3, front: "He plays soccer.", back: "彼はサッカーをします。", hint: "play -> plays (3単現)" },
                    { id: 4, front: "She reads books.", back: "彼女は本を読みます。", hint: "read -> reads" },
                    { id: 5, front: "We speak English.", back: "私たちは英語を話します。", hint: "speak = 話す" },
                    { id: 6, front: "They run fast.", back: "彼らは速く走ります。", hint: "run = 走る" },
                    { id: 7, front: "My mother cooks dinner.", back: "私の母は夕食を作ります。", hint: "cook -> cooks" },
                    { id: 8, front: "I do not play the piano.", back: "私はピアノを弾きません。", hint: "do not play" },
                    { id: 9, front: "He does not like natto.", back: "彼は納豆が好きではありません。", hint: "does not like" },
                    { id: 10, front: "Do you like baseball?", back: "あなたは野球が好きですか？", hint: "Start with Do" }
                ],
                questions: [
                    {
                        id: 21, original: "私はテニスをします。", translation: "I play tennis.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "します", en: "play" }, what: { jp: "テニスを", en: "tennis" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "します", category: 'does' }, { id: 'j3', text: "テニスを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "play", category: 'does' }, { id: 'e3', text: "tennis", category: 'what' }, { id: 'e4', text: "plays", category: 'does' }],
                        error: { part: 'does', wrong: "plays", correct: "play", sentenceParts: { who: "I", does: "plays", what: "tennis" } }
                    },
                    {
                        id: 22, original: "あなたはコーヒーが好きです。", translation: "You like coffee.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あなたは", en: "You" }, does: { jp: "好きです", en: "like" }, what: { jp: "コーヒーが", en: "coffee" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あなたは", category: 'who' }, { id: 'j2', text: "好きです", category: 'does' }, { id: 'j3', text: "コーヒーが", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "You", category: 'who' }, { id: 'e2', text: "like", category: 'does' }, { id: 'e3', text: "coffee", category: 'what' }, { id: 'e4', text: "likes", category: 'does' }],
                        error: { part: 'does', wrong: "likes", correct: "like", sentenceParts: { who: "You", does: "likes", what: "coffee" } }
                    },
                    {
                        id: 23, original: "彼はサッカーをします。", translation: "He plays soccer.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼は", en: "He" }, does: { jp: "します", en: "plays" }, what: { jp: "サッカーを", en: "soccer" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "します", category: 'does' }, { id: 'j3', text: "サッカーを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "He", category: 'who' }, { id: 'e2', text: "plays", category: 'does' }, { id: 'e3', text: "soccer", category: 'what' }, { id: 'e4', text: "play", category: 'does' }],
                        error: { part: 'does', wrong: "play", correct: "plays", sentenceParts: { who: "He", does: "play", what: "soccer" } }
                    },
                    {
                        id: 24, original: "彼女は本を読みます。", translation: "She reads books.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼女は", en: "She" }, does: { jp: "読みます", en: "reads" }, what: { jp: "本を", en: "books" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼女は", category: 'who' }, { id: 'j2', text: "読みます", category: 'does' }, { id: 'j3', text: "本を", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "She", category: 'who' }, { id: 'e2', text: "reads", category: 'does' }, { id: 'e3', text: "books", category: 'what' }, { id: 'e4', text: "read", category: 'does' }],
                        error: { part: 'does', wrong: "read", correct: "reads", sentenceParts: { who: "She", does: "read", what: "books" } }
                    },
                    {
                        id: 25, original: "私たちは英語を話します。", translation: "We speak English.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私たちは", en: "We" }, does: { jp: "話します", en: "speak" }, what: { jp: "英語を", en: "English" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私たちは", category: 'who' }, { id: 'j2', text: "話します", category: 'does' }, { id: 'j3', text: "英語を", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "We", category: 'who' }, { id: 'e2', text: "speak", category: 'does' }, { id: 'e3', text: "English", category: 'what' }, { id: 'e4', text: "speaks", category: 'does' }],
                        error: { part: 'does', wrong: "speaks", correct: "speak", sentenceParts: { who: "We", does: "speaks", what: "English" } }
                    },
                    {
                        id: 26, original: "彼らは速く走ります。", translation: "They run fast.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼らは", en: "They" }, does: { jp: "走ります", en: "run" }, what: null, where: null, when: { jp: "速く", en: "fast" } } }],
                        jpOptions: [{ id: 'j1', text: "彼らは", category: 'who' }, { id: 'j2', text: "走ります", category: 'does' }, { id: 'j3', text: "速く", category: 'when' }],
                        enOptions: [{ id: 'e1', text: "They", category: 'who' }, { id: 'e2', text: "run", category: 'does' }, { id: 'e3', text: "fast", category: 'when' }, { id: 'e4', text: "runs", category: 'does' }],
                        error: { part: 'does', wrong: "runs", correct: "run", sentenceParts: { who: "They", does: "runs", when: "fast" } }
                    },
                    {
                        id: 27, original: "私の母は夕食を作ります。", translation: "My mother cooks dinner.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私の母は", en: "My mother" }, does: { jp: "作ります", en: "cooks" }, what: { jp: "夕食を", en: "dinner" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私の母は", category: 'who' }, { id: 'j2', text: "作ります", category: 'does' }, { id: 'j3', text: "夕食を", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "My mother", category: 'who' }, { id: 'e2', text: "cooks", category: 'does' }, { id: 'e3', text: "dinner", category: 'what' }, { id: 'e4', text: "cook", category: 'does' }],
                        error: { part: 'does', wrong: "cook", correct: "cooks", sentenceParts: { who: "My mother", does: "cook", what: "dinner" } }
                    },
                    {
                        id: 28, original: "私はピアノを弾きません。", translation: "I do not play the piano.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "弾きません", en: "do not play" }, what: { jp: "ピアノを", en: "the piano" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "弾きません", category: 'does' }, { id: 'j3', text: "ピアノを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "do not play", category: 'does' }, { id: 'e3', text: "the piano", category: 'what' }, { id: 'e4', text: "does not play", category: 'does' }],
                        error: { part: 'does', wrong: "does not play", correct: "do not play", sentenceParts: { who: "I", does: "does not play", what: "the piano" } }
                    },
                    {
                        id: 29, original: "彼は納豆が好きではありません。", translation: "He does not like natto.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼は", en: "He" }, does: { jp: "好きではありません", en: "does not like" }, what: { jp: "納豆が", en: "natto" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "好きではありません", category: 'does' }, { id: 'j3', text: "納豆が", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "He", category: 'who' }, { id: 'e2', text: "does not like", category: 'does' }, { id: 'e3', text: "natto", category: 'what' }, { id: 'e4', text: "do not like", category: 'does' }],
                        error: { part: 'does', wrong: "do not like", correct: "does not like", sentenceParts: { who: "He", does: "do not like", what: "natto" } }
                    },
                    {
                        id: 30, original: "あなたは野球が好きですか？", translation: "Do you like baseball?",
                        rows: [{ id: 'm1', structure: { who: { jp: "あなたは", en: "you" }, does: { jp: "好きですか", en: "Do ... like" }, what: { jp: "野球が", en: "baseball" }, where: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あなたは", category: 'who' }, { id: 'j2', text: "好きですか", category: 'does' }, { id: 'j3', text: "野球が", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "you", category: 'who' }, { id: 'e2', text: "Do ... like", category: 'does' }, { id: 'e3', text: "baseball", category: 'what' }],
                        error: { part: 'does_pre', wrong: "Are", correct: "Do", sentenceParts: { does_pre: "Are", who: "you", does: "like", what: "baseball" } }
                    }
                ]
            },
            {
                id: 2026022401,
                title: "中1英語・名詞/冠詞の使い方",
                description: "名詞と冠詞(a/an/the)を語順で定着させるステージ。",
                introVideo: {
                    url: "https://youtu.be/fASxe82gL2g?si=dA_eNTQYcPxjzEPL",
                    title: "中1英語・名詞/冠詞の使い方（導入動画）"
                },
                stepOrder: ['videoIntro', 'flashcard', 'sort', 'fillin', 'complete'],
                flashcards: [
                    { id: 1, front: "名詞の意味は？", back: "①「人やモノやコトの名前」\n②「だれが、や、だれ・なにの位置に入る言葉」", hint: "名詞は名前であり、文の主要ポジションにも入ります" },
                    { id: 2, front: "「彼女の（ ）は天下一品だ」で入るのは？理由は？", back: "「美しさ」。理由は、主語の位置に入るのは名詞だから（「美しい」は名詞ではない）。", hint: "主語に置ける品詞かどうかで判断します" },
                    { id: 3, front: "名詞を大きく2種類に分けると？", back: "「固有名詞」と「普通の名詞」", hint: "名前そのものか、一般名詞かで分かれます" },
                    { id: 4, front: "「固有名詞」はどんな階級？", back: "超特権階級（ワンピースの天竜人やドラゴンボールの界王神レベル）", hint: "特別扱いされる名詞です" },
                    { id: 5, front: "固有名詞（Japanなど）の大きな特徴は？", back: "丸裸（何もつけない状態）で堂々と歩けること。", hint: "冠詞なしでそのまま使えます" },
                    { id: 6, front: "固有名詞を書く時、最初の文字は？", back: "大文字で書く", hint: "英語表記ルールです" },
                    { id: 7, front: "普通の名詞（apple, bookなど）はどんな階級？", back: "下々の庶民（一般庶民）", hint: "そのままでは使えない名詞です" },
                    { id: 8, front: "普通の名詞は「丸裸（単体）」で使える？", back: "できない。a/anを前につけたり、複数形のsを後ろにつけたりする必要がある。", hint: "普通名詞は何かをつけて使います" },
                    { id: 9, front: "a / an の歴史的な由来（元の意味）の数字は？", back: "1（one）", hint: "a/an は「ひとつ」の感覚です" },
                    { id: 10, front: "a / an の持つイメージは？", back: "「なんでもいいからとりあえず1つの」", hint: "特定しない1つです" },
                    { id: 11, front: "a と an の使い分けルールは？", back: "直後の名詞の発音が子音なら a、母音なら an。", hint: "スペルより発音で判断します" },
                    { id: 12, front: "hour につくのは a / an？理由は？", back: "an hour。スペルはhだが発音が母音から始まるため。", hint: "発音は「アワー」" },
                    { id: 13, front: "university につくのは a / an？理由は？", back: "a university。発音が「ユ」で始まり母音発音ではないため。", hint: "発音は「ユニバーシティ」" },
                    { id: 14, front: "the のコアイメージは？", back: "その場にいる人全員が「せーの」で1つに決まる感覚。", hint: "共通認識の1つです" },
                    { id: 15, front: "sun / moon に the がつく理由は？", back: "みんなが見て同じ1つに決まるから。", hint: "唯一性が高い名詞です" },
                    { id: 16, front: "the は必ず「その〜」と訳す必要がある？", back: "訳さなくてよい。英語の感覚として the がつく。", hint: "日本語訳より英語の感覚を優先します" },
                    { id: 17, front: "star には基本的に the がつく？理由は？", back: "つかないことが多い。星は多く、1つに特定しにくいから。", hint: "1つに決まるかどうかが鍵です" },
                    { id: 18, front: "「Open the door.」と言えるのはどんな状況？", back: "相手が「どのドアか」を1つに特定できる状況。", hint: "部屋にドアが1つなど" },
                    { id: 19, front: "「I have a dog.」の次は「( ) dog is...」のどれ？理由は？", back: "The。すでに話題に出た犬で、聞き手と話し手の間で1つに決まるから。", hint: "2回目の登場は the になりやすいです" }
                ],
                fillInQuestions: [
                    { id: 1, prompt: "I have ( ) dog.", translation: "（私は犬を1匹飼っています）", answer: "a" },
                    { id: 2, prompt: "This is ( ) apple.", translation: "（これは1つのりんごです）", answer: "an" },
                    { id: 3, prompt: "Look at ( ) sun.", translation: "（太陽を見て）", answer: "the" },
                    { id: 4, prompt: "Open ( ) door, please.", translation: "（ドアを開けてください ※部屋にドアは1つだけ）", answer: "the" },
                    { id: 5, prompt: "I play tennis for ( ) hour.", translation: "（私は1時間テニスをします ※hourの発音はアワー）", answer: "an" },
                    { id: 6, prompt: "He goes to ( ) university.", translation: "（彼は大学に通っています ※universityの発音はユニバーシティ）", answer: "a" },
                    { id: 7, prompt: "I have a cat. ( ) cat is cute.", translation: "（私は猫を飼っています。その猫は可愛いです）", answer: "The" },
                    { id: 8, prompt: "She is ( ) English teacher.", translation: "（彼女は英語の先生です）", answer: "an" },
                    { id: 9, prompt: "Look at ( ) moon.", translation: "（月を見て）", answer: "the" }
                ],
                questions: [
                    {
                        id: 1, original: "私は犬を1匹飼っています", translation: "I have a dog.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "飼っています", en: "have" }, what: { jp: "犬を1匹", en: "a dog" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "飼っています", category: 'does' }, { id: 'j3', text: "犬を1匹", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "have", category: 'does' }, { id: 'e3', text: "a dog", category: 'what' }]
                    },
                    {
                        id: 2, original: "これは1つのりんごです", translation: "This is an apple.",
                        rows: [{ id: 'm1', structure: { who: { jp: "これは", en: "This" }, does: { jp: "です(=)", en: "is" }, what: { jp: "1つのりんご", en: "an apple" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "これは", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "1つのりんご", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "This", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "an apple", category: 'what' }]
                    },
                    {
                        id: 4, original: "私は1時間テニスをします", translation: "I play tennis for an hour.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "します", en: "play" }, what: { jp: "テニスを", en: "tennis" }, where: null, how: null, when: { jp: "1時間", en: "for an hour" } } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "します", category: 'does' }, { id: 'j3', text: "テニスを", category: 'what' }, { id: 'j4', text: "1時間", category: 'when' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "play", category: 'does' }, { id: 'e3', text: "tennis", category: 'what' }, { id: 'e4', text: "for an hour", category: 'when' }]
                    },
                    {
                        id: 5, original: "彼は大学に通っています", translation: "He goes to a university.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼は", en: "He" }, does: { jp: "通っています", en: "goes" }, what: null, where: { jp: "大学に", en: "to a university" }, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "通っています", category: 'does' }, { id: 'j3', text: "大学に", category: 'where' }],
                        enOptions: [{ id: 'e1', text: "He", category: 'who' }, { id: 'e2', text: "goes", category: 'does' }, { id: 'e3', text: "to a university", category: 'where' }]
                    },
                    {
                        id: 6, original: "私は日本に住んでいます", translation: "I live in Japan.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "住んでいます", en: "live" }, what: null, where: { jp: "日本に", en: "in Japan" }, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "住んでいます", category: 'does' }, { id: 'j3', text: "日本に", category: 'where' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "live", category: 'does' }, { id: 'e3', text: "in Japan", category: 'where' }]
                    },
                    {
                        id: 7, original: "私は猫を飼っています。その猫は可愛いです", translation: "I have a cat. The cat is cute.",
                        rows: [
                            { id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "飼っています", en: "have" }, what: { jp: "猫を", en: "a cat" }, where: null, how: null, when: null } },
                            { id: 'm2', structure: { who: { jp: "その猫は", en: "The cat" }, does: { jp: "です(=)", en: "is" }, what: { jp: "可愛い", en: "cute" }, where: null, how: null, when: null } }
                        ],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "飼っています", category: 'does' }, { id: 'j3', text: "猫を", category: 'what' }, { id: 'j4', text: "その猫は", category: 'who' }, { id: 'j5', text: "です(=)", category: 'does' }, { id: 'j6', text: "可愛い", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "have", category: 'does' }, { id: 'e3', text: "a cat", category: 'what' }, { id: 'e4', text: "The cat", category: 'who' }, { id: 'e5', text: "is", category: 'does' }, { id: 'e6', text: "cute", category: 'what' }]
                    },
                    {
                        id: 8, original: "彼女は英語の先生です", translation: "She is an English teacher.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼女は", en: "She" }, does: { jp: "です(=)", en: "is" }, what: { jp: "英語の先生", en: "an English teacher" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼女は", category: 'who' }, { id: 'j2', text: "です(=)", category: 'does' }, { id: 'j3', text: "英語の先生", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "She", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "an English teacher", category: 'what' }]
                    }
                ]
            },
            {
                id: 2026022502,
                title: "所有格と形容詞",
                introVideo: {
                    url: "https://youtu.be/PWoT7ifM0lU?si=9Qwhpl3jK6Qs7UEq",
                    title: "所有格と形容詞（導入動画）"
                },
                stepOrder: ['videoIntro', 'flashcard', 'instant', 'writing', 'complete'],
                flashcards: [
                    { id: 1, front: "固有名詞以外の普通の名詞は単体で使えないため、どうしなければならないか？", back: "必ず前になにか言葉をつけてあげないといけない", hint: "普通名詞は丸裸で使えません" },
                    { id: 2, front: "所有格とは、どのような意味を表す言葉か？", back: "誰のものかを表す\n「〜の」（私の、あなたの、彼の、彼女の、それらのなど）", hint: "所有格は ownership を表します" },
                    { id: 3, front: "所有格の正しい覚え方は？", back: "my pen, your desk のように、後ろの言葉と必ず1セットで覚えてしまうこと", hint: "所有格は後ろの名詞とセット" },
                    { id: 4, front: "わたしのねこ", back: "my cat", hint: "my + 名詞" },
                    { id: 5, front: "あなたのねこ", back: "your cat", hint: "your + 名詞" },
                    { id: 6, front: "彼のねこ", back: "his cat", hint: "his + 名詞" },
                    { id: 7, front: "彼女のねこ", back: "her cat", hint: "her + 名詞" },
                    { id: 8, front: "私たちのねこ", back: "our cat", hint: "our + 名詞" },
                    { id: 9, front: "彼らのねこ", back: "their cat", hint: "their + 名詞" },
                    { id: 10, front: "彼女らのねこ", back: "their cat", hint: "their + 名詞" },
                    { id: 11, front: "それらのねこ", back: "their cat", hint: "their + 名詞" },
                    { id: 12, front: "彼らの、彼女らの、それらの", back: "their", hint: "複数の「〜の」は their" },
                    { id: 13, front: "「あしだのねこ」のように、人の名前に「〜の」をつける場合、どう表すか？", back: "人の名前の後ろに「'」をつけ、その後に「s」をつける。\nAshida's cat", hint: "名前 + 's + 名詞" },
                    { id: 14, front: "this と that の意味をそれぞれ答えよ。", back: "this＝「この、これ」\nthat＝「あの、あれ」", hint: "近い this / 遠い that" },
                    { id: 15, front: "このねこ", back: "this cat", hint: "this + 名詞" },
                    { id: 16, front: "あのねこ", back: "that cat", hint: "that + 名詞" },
                    { id: 17, front: "形容詞とは、どのような働きをする言葉か？", back: "名詞を詳しく説明する言葉", hint: "名詞を説明する語" },
                    { id: 18, front: "形容詞は、どこにくっつける言葉か？", back: "名詞の前", hint: "英語は形容詞を前に置く" },
                    { id: 19, front: "形容詞の「old」の意味は？", back: "古い", hint: "old = 古い" },
                    { id: 20, front: "形容詞の「big」の意味は？", back: "大きな", hint: "big = 大きな" },
                    { id: 21, front: "形容詞の「good」の意味は？", back: "良い", hint: "good = 良い" },
                    { id: 22, front: "形容詞の「bad」の意味は？", back: "悪い", hint: "bad = 悪い" },
                    { id: 23, front: "形容詞の「happy」の意味は？", back: "幸せな", hint: "happy = 幸せな" },
                    { id: 24, front: "形容詞の「new」の意味は？", back: "新しい", hint: "new = 新しい" },
                    { id: 25, front: "形容詞の「busy」の意味は？", back: "忙しい", hint: "busy = 忙しい" },
                    { id: 26, front: "形容詞の「kind」の意味は？", back: "親切な", hint: "kind = 親切な" },
                    { id: 27, front: "「私の古い家」を英語にする際の正しい語順とフレーズを答えよ。", back: "所有格 + 形容詞 + 名詞（my old house）", hint: "my / old / house の順" },
                    { id: 28, front: "「この新しい車」を英語で答えよ。", back: "this new car", hint: "this + new + car" },
                    { id: 29, front: "「その大きなカバン」を英語で答えよ。", back: "the big bag", hint: "the + big + bag" },
                    { id: 30, front: "「一人の良い先生」を英語で答えよ。", back: "a good teacher", hint: "a + good + teacher" }
                ],
                instantQuestions: [
                    { id: 1, jp: "わたしのねこ", answer: "my cat" },
                    { id: 2, jp: "あなたのねこ", answer: "your cat" },
                    { id: 3, jp: "彼のねこ", answer: "his cat" },
                    { id: 4, jp: "彼女のねこ", answer: "her cat" },
                    { id: 5, jp: "私たちのねこ", answer: "our cat" },
                    { id: 6, jp: "彼らのねこ", answer: "their cat" },
                    { id: 7, jp: "彼女らのねこ", answer: "their cat" },
                    { id: 8, jp: "それらのねこ", answer: "their cat" },
                    { id: 9, jp: "この新しい車", answer: "this new car" },
                    { id: 10, jp: "あの新しい車", answer: "that new car" },
                    { id: 11, jp: "新しい車", answer: "a new car" },
                    { id: 12, jp: "私の新しい車", answer: "my new car" },
                    { id: 13, jp: "それらの新しい車", answer: "thier new car" },
                    { id: 14, jp: "その新しい車", answer: "the new car" },
                    { id: 15, jp: "わたしの車", answer: "my car" },
                    { id: 16, jp: "あなたの家", answer: "your house" },
                    { id: 17, jp: "彼のお父さん", answer: "his father" },
                    { id: 18, jp: "彼女のペン", answer: "her pen" },
                    { id: 19, jp: "私たちのチーム", answer: "our team" },
                    { id: 20, jp: "彼らの自転車", answer: "their bicycle" },
                    { id: 21, jp: "このノート", answer: "this notebook" },
                    { id: 22, jp: "あの男の子", answer: "that boy" },
                    { id: 23, jp: "わたしの古い家", answer: "my old house" },
                    { id: 24, jp: "（1つの）リンゴ", answer: "an apple" },
                    { id: 25, jp: "1時間", answer: "an hour" },
                    { id: 26, jp: "そのドア", answer: "the door" },
                    { id: 27, jp: "（1冊の）本", answer: "a book" },
                    { id: 28, jp: "そのイス", answer: "the chair" },
                    { id: 29, jp: "その大きなカバン", answer: "the big bag" },
                    { id: 30, jp: "（1人の）良い先生", answer: "a good teacher" },
                    { id: 31, jp: "（1匹の）イヌ", answer: "a dog" },
                    { id: 32, jp: "（1戸の）家", answer: "a house" },
                    { id: 33, jp: "（1人の）英語の先生", answer: "an English teacher" },
                    { id: 34, jp: "（1人の）サッカー選手", answer: "a soccer player" }
                ],
                fillInQuestions: [
                    { id: 1, translation: "わたしのねこ", prompt: "( ) cat", answer: "my" },
                    { id: 2, translation: "あなたのねこ", prompt: "( ) cat", answer: "your" },
                    { id: 3, translation: "彼のねこ", prompt: "( ) cat", answer: "his" },
                    { id: 4, translation: "彼女のねこ", prompt: "( ) cat", answer: "her" },
                    { id: 5, translation: "私たちのねこ", prompt: "( ) cat", answer: "our" },
                    { id: 6, translation: "彼らのねこ", prompt: "( ) cat", answer: "their" },
                    { id: 7, translation: "彼女らのねこ", prompt: "( ) cat", answer: "their" },
                    { id: 8, translation: "それらのねこ", prompt: "( ) cat", answer: "their" },
                    { id: 9, translation: "わたしの車", prompt: "( ) car", answer: "my" },
                    { id: 10, translation: "このねこ", prompt: "( ) cat", answer: "this" },
                    { id: 11, translation: "あのねこ", prompt: "( ) cat", answer: "that" },
                    { id: 12, translation: "そのねこ", prompt: "( ) cat", answer: "the" },
                    { id: 13, translation: "新しい車", prompt: "( ) ( ) car", answer: "a new" },
                    { id: 14, translation: "私の新しい車", prompt: "( ) ( ) car", answer: "my new" },
                    { id: 15, translation: "それらの新しい車", prompt: "( ) ( ) car", answer: "thier new" },
                    { id: 16, translation: "その新しい車", prompt: "( ) ( ) car", answer: "the new" },
                    { id: 17, translation: "この新しい車", prompt: "( ) ( ) car", answer: "this new" },
                    { id: 18, translation: "あの新しい車", prompt: "( ) ( ) car", answer: "that new" },
                    { id: 19, translation: "あなたの家", prompt: "( ) house", answer: "your" },
                    { id: 20, translation: "彼のお父さん", prompt: "( ) father", answer: "his" },
                    { id: 21, translation: "彼女のペン", prompt: "( ) pen", answer: "her" },
                    { id: 22, translation: "私たちのチーム", prompt: "( ) team", answer: "our" },
                    { id: 23, translation: "彼らの自転車", prompt: "( ) bicycle", answer: "their" },
                    { id: 24, translation: "このノート", prompt: "( ) notebook", answer: "this" },
                    { id: 25, translation: "あの男の子", prompt: "( ) boy", answer: "that" },
                    { id: 26, translation: "わたしの古い家", prompt: "( ) ( ) house", answer: "my old" },
                    { id: 27, translation: "この新しい車", prompt: "( ) ( ) car", answer: "this new" },
                    { id: 28, translation: "(1つの) リンゴ", prompt: "( ) apple", answer: "an" },
                    { id: 29, translation: "1時間", prompt: "( ) hour", answer: "an" },
                    { id: 30, translation: "そのドア", prompt: "( ) door", answer: "the" },
                    { id: 31, translation: "(1冊の)本", prompt: "( ) book", answer: "a" },
                    { id: 32, translation: "そのイス", prompt: "( ) chair", answer: "the" },
                    { id: 33, translation: "その大きなカバン", prompt: "( ) ( ) bag", answer: "the big" },
                    { id: 34, translation: "(1人の)良い先生", prompt: "( ) ( ) teacher", answer: "a good" },
                    { id: 35, translation: "(1匹の)イヌ", prompt: "( ) dog", answer: "a" },
                    { id: 36, translation: "(1戸の)家", prompt: "( ) ( )", answer: "a house" },
                    { id: 37, translation: "(1人の)英語の先生", prompt: "( ) ( ) ( )", answer: "an English teacher" },
                    { id: 38, translation: "(1人の)サッカー選手", prompt: "( ) ( ) ( )", answer: "a soccer player" }
                ],
                writingQuestions: [
                    { id: 1, jp: "わたしのねこ", answer: "my cat" },
                    { id: 2, jp: "あなたのねこ", answer: "your cat" },
                    { id: 3, jp: "彼のねこ", answer: "his cat" },
                    { id: 4, jp: "彼女のねこ", answer: "her cat" },
                    { id: 5, jp: "私たちのねこ", answer: "our cat" },
                    { id: 6, jp: "彼らのねこ", answer: "their cat" },
                    { id: 7, jp: "彼女らのねこ", answer: "their cat" },
                    { id: 8, jp: "それらのねこ", answer: "their cat" },
                    { id: 9, jp: "この新しい車", answer: "this new car" },
                    { id: 10, jp: "あの新しい車", answer: "that new car" },
                    { id: 11, jp: "新しい車", answer: "a new car" },
                    { id: 12, jp: "私の新しい車", answer: "my new car" },
                    { id: 13, jp: "それらの新しい車", answer: "thier new car" },
                    { id: 14, jp: "その新しい車", answer: "the new car" },
                    { id: 15, jp: "わたしの車", answer: "my car" },
                    { id: 16, jp: "あなたの家", answer: "your house" },
                    { id: 17, jp: "彼のお父さん", answer: "his father" },
                    { id: 18, jp: "彼女のペン", answer: "her pen" },
                    { id: 19, jp: "私たちのチーム", answer: "our team" },
                    { id: 20, jp: "彼らの自転車", answer: "their bicycle" },
                    { id: 21, jp: "このノート", answer: "this notebook" },
                    { id: 22, jp: "あの男の子", answer: "that boy" },
                    { id: 23, jp: "わたしの古い家", answer: "my old house" },
                    { id: 24, jp: "（1つの）リンゴ", answer: "an apple" },
                    { id: 25, jp: "1時間", answer: "an hour" },
                    { id: 26, jp: "そのドア", answer: "the door" },
                    { id: 27, jp: "（1冊の）本", answer: "a book" },
                    { id: 28, jp: "そのイス", answer: "the chair" },
                    { id: 29, jp: "その大きなカバン", answer: "the big bag" },
                    { id: 30, jp: "（1人の）良い先生", answer: "a good teacher" },
                    { id: 31, jp: "（1匹の）イヌ", answer: "a dog" },
                    { id: 32, jp: "（1戸の）家", answer: "a house" },
                    { id: 33, jp: "（1人の）英語の先生", answer: "an English teacher" },
                    { id: 34, jp: "（1人の）サッカー選手", answer: "a soccer player" }
                ],
                questions: []
            },
            {
                id: 2026022601,
                title: "名詞の複数形",
                stepOrder: ['flashcard', 'instant', 'fillin', 'writing', 'complete'],
                flashcards: [
                    { id: 1, front: "日本語の数え方の特徴（面倒くさい点）は何か？", back: "犬は「匹」、馬は「頭」、本は「冊」など、名詞によって数える「単位」が変わること", hint: "名詞ごとに単位が変わります" },
                    { id: 2, front: "英語の数え方の特徴（シンプルな点）は何か？", back: "単位がなく、名詞の前に「a」や「数字」を置くだけで数えられること", hint: "a/数字 + 名詞で数えます" },
                    { id: 3, front: "英語で、名詞が「2つ以上（複数）」になった場合、基本はどうするか？", back: "名詞の後ろに「s」をつける", hint: "基本は -s" },
                    { id: 4, front: "（1匹の）犬", back: "a dog", hint: "a + 名詞" },
                    { id: 5, front: "（1頭の）馬", back: "a horse", hint: "a + 名詞" },
                    { id: 6, front: "（1冊の）本", back: "a book", hint: "a + 名詞" },
                    { id: 7, front: "（1脚の）いす", back: "a chair", hint: "a + 名詞" },
                    { id: 8, front: "（1冊の）本", back: "a book", hint: "a + 名詞" },
                    { id: 9, front: "2冊の本", back: "two books", hint: "two + 複数形" },
                    { id: 10, front: "3冊の本", back: "three books", hint: "three + 複数形" },
                    { id: 11, front: "たくさんの本", back: "many books", hint: "many + 複数形" },
                    { id: 12, front: "名詞の語尾が「s, sh, o, ch, x」の時は、何をつけるか？", back: "es をつける（例: es, es, es）", hint: "語尾が特定パターンなら -es" },
                    { id: 13, front: "「s, sh, o, ch, x」で終わる時の覚え方（語呂合わせ）は？", back: "「チーズ（ch, s）しょっ（sh, o）くす（x）」（ジャムおじさんとチーズの物語）", hint: "語呂でまとめて暗記" },
                    { id: 14, front: "busの複数形は？", back: "buses", hint: "s語尾は -es" },
                    { id: 15, front: "dishの複数形は？", back: "dishes", hint: "sh語尾は -es" },
                    { id: 16, front: "boxの複数形は？", back: "boxes", hint: "x語尾は -es" },
                    { id: 17, front: "名詞の語尾が「子音 ＋ y」の時は、どう変化させるか？", back: "y を i に変えて es をつける", hint: "子音 + y -> ies" },
                    { id: 18, front: "cityの複数形は？", back: "cities", hint: "y -> ies" },
                    { id: 19, front: "babyの複数形は？", back: "babies", hint: "y -> ies" },
                    { id: 20, front: "名詞の語尾が「f」または「fe」の時は、どう変化させるか？", back: "f（またはfe）を v に変えて es をつける", hint: "f/fe -> ves" },
                    { id: 21, front: "leafの複数形は？", back: "leaves", hint: "f -> ves" },
                    { id: 22, front: "man（男の人）の複数形は？", back: "men（メン）", hint: "不規則変化" },
                    { id: 23, front: "woman（女の人）の複数形とその発音は？", back: "women（ウィメン）※ウーメンではない", hint: "women の発音に注意" },
                    { id: 24, front: "foot（足）の複数形は？", back: "feet（フィート）", hint: "oo -> ee" },
                    { id: 25, front: "child（子ども）の複数形とその発音は？", back: "children（チルドレン）", hint: "不規則変化" },
                    { id: 26, front: "fish（魚）の複数形は？", back: "fish（そのまま、形が変わらない）", hint: "同形の名詞" },
                    { id: 27, front: "1", back: "one", hint: "数詞" },
                    { id: 28, front: "2", back: "two", hint: "数詞" },
                    { id: 29, front: "3", back: "three", hint: "数詞" },
                    { id: 30, front: "4", back: "four", hint: "数詞" },
                    { id: 31, front: "5", back: "five", hint: "数詞" },
                    { id: 32, front: "6", back: "six", hint: "数詞" },
                    { id: 33, front: "7", back: "seven", hint: "数詞" },
                    { id: 34, front: "8", back: "eight", hint: "数詞" },
                    { id: 35, front: "9", back: "nine", hint: "数詞" },
                    { id: 36, front: "10", back: "ten", hint: "数詞" },
                    { id: 37, front: "11", back: "eleven", hint: "数詞" },
                    { id: 38, front: "12", back: "twelve", hint: "数詞" },
                    { id: 39, front: "13", back: "thirteen", hint: "数詞" },
                    { id: 40, front: "14", back: "fourteen", hint: "数詞" },
                    { id: 41, front: "15", back: "fifteen", hint: "数詞" },
                    { id: 42, front: "16", back: "sixteen", hint: "数詞" },
                    { id: 43, front: "17", back: "seventeen", hint: "数詞" },
                    { id: 44, front: "18", back: "eighteen", hint: "数詞" },
                    { id: 45, front: "19", back: "nineteen", hint: "数詞" },
                    { id: 46, front: "20", back: "twenty", hint: "数詞" },
                    { id: 47, front: "30", back: "thirty", hint: "数詞" },
                    { id: 48, front: "40", back: "forty", hint: "数詞" },
                    { id: 49, front: "50", back: "fifty", hint: "数詞" },
                    { id: 50, front: "60", back: "sixty", hint: "数詞" },
                    { id: 51, front: "70", back: "seventy", hint: "数詞" },
                    { id: 52, front: "80", back: "eighty", hint: "数詞" },
                    { id: 53, front: "90", back: "ninety", hint: "数詞" },
                    { id: 54, front: "100", back: "hundred", hint: "数詞" }
                ],
                instantQuestions: [
                    { id: 1, jp: "わたしの車", answer: "my car" },
                    { id: 2, jp: "あなたの家", answer: "your house" },
                    { id: 3, jp: "彼のお父さん", answer: "his father" },
                    { id: 4, jp: "彼女のペン", answer: "her pen" },
                    { id: 5, jp: "私たちのチーム", answer: "our team" },
                    { id: 6, jp: "彼らの自転車", answer: "their bicycle" },
                    { id: 7, jp: "このノート", answer: "this notebook" },
                    { id: 8, jp: "あの男の子", answer: "that boy" },
                    { id: 9, jp: "わたしの古い家", answer: "my old house" },
                    { id: 10, jp: "この新しい車", answer: "this new car" },
                    { id: 11, jp: "（1つの）リンゴ", answer: "an apple" },
                    { id: 12, jp: "1時間", answer: "an hour" },
                    { id: 13, jp: "そのドア", answer: "the door" },
                    { id: 14, jp: "（1冊の）本", answer: "a book" },
                    { id: 15, jp: "そのイス", answer: "the chair" },
                    { id: 16, jp: "その大きなカバン", answer: "the big bag" },
                    { id: 17, jp: "（1人の）良い先生", answer: "a good teacher" },
                    { id: 18, jp: "（1匹の）イヌ", answer: "a dog" },
                    { id: 19, jp: "2匹のイヌ", answer: "two dogs" },
                    { id: 20, jp: "10匹のイヌ", answer: "ten dogs" },
                    { id: 21, jp: "（1戸の）家", answer: "a house" },
                    { id: 22, jp: "3戸の家", answer: "three houses" },
                    { id: 23, jp: "13戸の家", answer: "thirteen houses" },
                    { id: 24, jp: "たくさんの家", answer: "many houses" },
                    { id: 25, jp: "（1人の）英語の先生", answer: "an English teacher" },
                    { id: 26, jp: "4人の英語の先生", answer: "four English teachers" },
                    { id: 27, jp: "12人の英語の先生", answer: "twelve English teachers" },
                    { id: 28, jp: "（1人の）サッカー選手", answer: "a soccer player" },
                    { id: 29, jp: "5人のサッカー選手", answer: "five soccer players" },
                    { id: 30, jp: "11人のサッカー選手", answer: "eleven soccer players" },
                    { id: 31, jp: "たくさんのサッカー選手", answer: "many soccer players" }
                ],
                fillInQuestions: [
                    { id: 1, translation: "わたしの車", prompt: "( ) car", answer: "my" },
                    { id: 2, translation: "あなたの家", prompt: "( ) house", answer: "your" },
                    { id: 3, translation: "彼のお父さん", prompt: "( ) father", answer: "his" },
                    { id: 4, translation: "彼女のペン", prompt: "( ) pen", answer: "her" },
                    { id: 5, translation: "私たちのチーム", prompt: "( ) team", answer: "our" },
                    { id: 6, translation: "彼らの自転車", prompt: "( ) bicycle", answer: "their" },
                    { id: 7, translation: "このノート", prompt: "( ) notebook", answer: "this" },
                    { id: 8, translation: "あの男の子", prompt: "( ) boy", answer: "that" },
                    { id: 9, translation: "わたしの古い家", prompt: "( ) ( ) house", answer: "my old" },
                    { id: 10, translation: "この新しい車", prompt: "( ) ( ) car", answer: "this new" },
                    { id: 11, translation: "(1つの) リンゴ", prompt: "( ) apple", answer: "an" },
                    { id: 12, translation: "1時間", prompt: "( ) hour", answer: "an" },
                    { id: 13, translation: "そのドア", prompt: "( ) door", answer: "the" },
                    { id: 14, translation: "(1冊の)本", prompt: "( ) book", answer: "a" },
                    { id: 15, translation: "そのイス", prompt: "( ) chair", answer: "the" },
                    { id: 16, translation: "その大きなカバン", prompt: "( ) ( ) bag", answer: "the big" },
                    { id: 17, translation: "(1人の)良い先生", prompt: "( ) ( ) teacher", answer: "a good" },
                    { id: 18, translation: "(1匹の)イヌ", prompt: "( ) dog", answer: "a" },
                    { id: 19, translation: "2匹のイヌ", prompt: "( ) ( )", answer: "two dogs" },
                    { id: 20, translation: "10匹のイヌ", prompt: "( ) ( )", answer: "ten dogs" },
                    { id: 21, translation: "(1戸の)家", prompt: "( ) ( )", answer: "a house" },
                    { id: 22, translation: "3戸の家", prompt: "( ) ( )", answer: "three houses" },
                    { id: 23, translation: "13戸の家", prompt: "( ) ( )", answer: "thirteen houses" },
                    { id: 24, translation: "たくさんの家", prompt: "( ) ( )", answer: "many houses" },
                    { id: 25, translation: "(1人の)英語の先生", prompt: "( ) ( ) ( )", answer: "an English teacher" },
                    { id: 26, translation: "4人の英語の先生", prompt: "( ) ( ) ( )", answer: "four English teachers" },
                    { id: 27, translation: "12人の英語の先生", prompt: "( ) ( ) ( )", answer: "twelve English teachers" },
                    { id: 28, translation: "(1人の)サッカー選手", prompt: "( ) ( ) ( )", answer: "a soccer player" },
                    { id: 29, translation: "5人のサッカー選手", prompt: "( ) ( ) ( )", answer: "five soccer players" },
                    { id: 30, translation: "11人のサッカー選手", prompt: "( ) ( ) ( )", answer: "eleven soccer players" },
                    { id: 31, translation: "たくさんのサッカー選手", prompt: "( ) ( ) ( )", answer: "many soccer players" }
                ],
                writingQuestions: [
                    { id: 1, jp: "1", answer: "one" },
                    { id: 2, jp: "2", answer: "two" },
                    { id: 3, jp: "3", answer: "three" },
                    { id: 4, jp: "4", answer: "four" },
                    { id: 5, jp: "5", answer: "five" },
                    { id: 6, jp: "6", answer: "six" },
                    { id: 7, jp: "7", answer: "seven" },
                    { id: 8, jp: "8", answer: "eight" },
                    { id: 9, jp: "9", answer: "nine" },
                    { id: 10, jp: "10", answer: "ten" },
                    { id: 11, jp: "11", answer: "eleven" },
                    { id: 12, jp: "12", answer: "twelve" },
                    { id: 13, jp: "13", answer: "thirteen" },
                    { id: 14, jp: "14", answer: "fourteen" },
                    { id: 15, jp: "15", answer: "fifteen" },
                    { id: 16, jp: "16", answer: "sixteen" },
                    { id: 17, jp: "17", answer: "seventeen" },
                    { id: 18, jp: "18", answer: "eighteen" },
                    { id: 19, jp: "19", answer: "nineteen" },
                    { id: 20, jp: "20", answer: "twenty" },
                    { id: 21, jp: "30", answer: "thirty" },
                    { id: 22, jp: "40", answer: "forty" },
                    { id: 23, jp: "50", answer: "fifty" },
                    { id: 24, jp: "60", answer: "sixty" },
                    { id: 25, jp: "70", answer: "seventy" },
                    { id: 26, jp: "80", answer: "eighty" },
                    { id: 27, jp: "90", answer: "ninety" },
                    { id: 28, jp: "100", answer: "hundred" },
                    { id: 29, jp: "わたしの車", answer: "my car" },
                    { id: 30, jp: "あなたの家", answer: "your house" },
                    { id: 31, jp: "彼のお父さん", answer: "his father" },
                    { id: 32, jp: "彼女のペン", answer: "her pen" },
                    { id: 33, jp: "私たちのチーム", answer: "our team" },
                    { id: 34, jp: "彼らの自転車", answer: "their bicycle" },
                    { id: 35, jp: "このノート", answer: "this notebook" },
                    { id: 36, jp: "あの男の子", answer: "that boy" },
                    { id: 37, jp: "わたしの古い家", answer: "my old house" },
                    { id: 38, jp: "この新しい車", answer: "this new car" },
                    { id: 39, jp: "（1つの）リンゴ", answer: "an apple" },
                    { id: 40, jp: "1時間", answer: "an hour" },
                    { id: 41, jp: "そのドア", answer: "the door" },
                    { id: 42, jp: "（1冊の）本", answer: "a book" },
                    { id: 43, jp: "そのイス", answer: "the chair" },
                    { id: 44, jp: "その大きなカバン", answer: "the big bag" },
                    { id: 45, jp: "（1人の）良い先生", answer: "a good teacher" },
                    { id: 46, jp: "（1匹の）イヌ", answer: "a dog" },
                    { id: 47, jp: "2匹のイヌ", answer: "two dogs" },
                    { id: 48, jp: "10匹のイヌ", answer: "ten dogs" },
                    { id: 49, jp: "（1戸の）家", answer: "a house" },
                    { id: 50, jp: "3戸の家", answer: "three houses" },
                    { id: 51, jp: "13戸の家", answer: "thirteen houses" },
                    { id: 52, jp: "たくさんの家", answer: "many houses" },
                    { id: 53, jp: "（1人の）英語の先生", answer: "an English teacher" },
                    { id: 54, jp: "4人の英語の先生", answer: "four English teachers" },
                    { id: 55, jp: "12人の英語の先生", answer: "twelve English teachers" },
                    { id: 56, jp: "（1人の）サッカー選手", answer: "a soccer player" },
                    { id: 57, jp: "5人のサッカー選手", answer: "five soccer players" },
                    { id: 58, jp: "11人のサッカー選手", answer: "eleven soccer players" },
                    { id: 59, jp: "たくさんのサッカー選手", answer: "many soccer players" }
                ],
                questions: []
            },
            {
                id: 2026022602,
                title: "数えられない名詞",
                stepOrder: ['flashcard', 'instant', 'fillin', 'writing', 'complete'],
                flashcards: [
                    { id: 1, front: "日本語は名詞を数えるとき、どのような特徴があるか？", back: "「本なら1冊」「イスなら1脚」のように、何でもかんでも「単位」をつけて数える", hint: "日本語は単位で数えます" },
                    { id: 2, front: "英語における名詞の考え方で、日本語にはない「新しい考え方（分類）」は何か？", back: "「数えられる名詞」と「数えられない名詞」があること", hint: "英語はまず可算/不可算を判断します" },
                    { id: 3, front: "「数えられる名詞」とは、どのような特徴を持つものか？（2つのポイント）", back: "①決まった、くっきりとした「形」があるもの\n②壊したり切ったりしたら「ダメ（元の機能がなくなる）」なもの", hint: "形があり、壊すと機能を失うもの" },
                    { id: 4, front: "壊したり切ったりしたらダメな「数えられる名詞」の例を挙げよ。", back: "本、赤ちゃん、犬、猫、ペン、スマホなど", hint: "book, baby, dog など" },
                    { id: 5, front: "「数えられない名詞」とは、どのような特徴を持つものか？（2つのポイント）", back: "①決まった形がないもの、くっきりとした形がないがないもの、目には見えないもの\n②壊したり切ったりしても「OK」なもの", hint: "形がない/見えない、切っても性質が保たれるもの" },
                    { id: 6, front: "形がなくて目に見えない「数えられない名詞」の例を挙げよ。", back: "愛 (love)、時間 (time)、宿題 (homework)、お知らせ (news)、お金 (money)", hint: "概念系は不可算が多いです" },
                    { id: 7, front: "「お金 (money)や宿題 (homework)」が数えられない名詞の理由は？", back: "紙幣や硬貨、テキストには形があるが、「お金 (money)や宿題 (homework)」という言葉自体はそれらをまとめた「概念（目に見えないもの）」だから", hint: "単体ではなく概念を指すため" },
                    { id: 8, front: "壊したり切ったりしても元の性質が変わらない「数えられない名詞」の例を挙げよ。", back: "水 (water)、チョーク (chalk)、チーズ (cheese)、パン (bread)、紙 (paper)、空気 (air)", hint: "物質名詞は不可算が多いです" },
                    { id: 9, front: "数えられない名詞には「つけられないもの」が2つある。それは何か？", back: "① 1つを表す「a (an)」\n② 2つ以上を表す「複数形の s」", hint: "a/an と複数形 s を直接つけません" },
                    { id: 10, front: "水やお金など、数えられない名詞をどうしても数えたい時はどうするか？", back: "水や茶などが入っている「容器（グラスやカップ）」や「単位」の方を数える", hint: "容器・単位を可算にします" },
                    { id: 11, front: "「1杯の水」を英語で言うと？", back: "a glass of water", hint: "glass を数えます" },
                    { id: 12, front: "「1杯のお茶」を英語で言うと？", back: "a cup of tea", hint: "cup を数えます" },
                    { id: 13, front: "「1枚の紙」を英語で言うと？", back: "a piece of paper", hint: "piece を数えます" },
                    { id: 14, front: "「2杯の水」と言う時、複数形の「s」はどこにつけるか？", back: "グラスの方につける（two glasses of water）※waterにsをつけて「two glasses of waters」とするのは絶対にダメ！", hint: "water ではなく glasses が複数形です" },
                    { id: 15, front: "英語で名詞を見た時、真っ先に判断しなければならない「2つの視点」とは何か？", back: "① 数えられるか、数えられないか\n②（数えられる場合）単数か、複数か", hint: "可算/不可算、単数/複数の順で判断" }
                ],
                instantQuestions: [
                    { id: 1, jp: "わたしの車", answer: "my car" },
                    { id: 2, jp: "あなたの家", answer: "your house" },
                    { id: 3, jp: "彼のお父さん", answer: "his father" },
                    { id: 4, jp: "彼女のペン", answer: "her pen" },
                    { id: 5, jp: "私たちのチーム", answer: "our team" },
                    { id: 6, jp: "彼らの自転車", answer: "their bicycle" },
                    { id: 7, jp: "このノート", answer: "this notebook" },
                    { id: 8, jp: "あの男の子", answer: "that boy" },
                    { id: 9, jp: "わたしの古い家", answer: "my old house" },
                    { id: 10, jp: "この新しい車", answer: "this new car" },
                    { id: 11, jp: "（1つの）リンゴ", answer: "an apple" },
                    { id: 12, jp: "1時間", answer: "an hour" },
                    { id: 13, jp: "そのドア", answer: "the door" },
                    { id: 14, jp: "（1冊の）本", answer: "a book" },
                    { id: 15, jp: "そのイス", answer: "the chair" },
                    { id: 16, jp: "その大きなカバン", answer: "the big bag" },
                    { id: 17, jp: "（1人の）良い先生", answer: "a good teacher" },
                    { id: 18, jp: "（1匹の）イヌ", answer: "a dog" },
                    { id: 19, jp: "2匹のイヌ", answer: "two dogs" },
                    { id: 20, jp: "10匹のイヌ", answer: "ten dogs" },
                    { id: 21, jp: "（1戸の）家", answer: "a house" },
                    { id: 22, jp: "3戸の家", answer: "three houses" },
                    { id: 23, jp: "13戸の家", answer: "thirteen houses" },
                    { id: 24, jp: "たくさんの家", answer: "many houses" },
                    { id: 25, jp: "（1人の）英語の先生", answer: "an English teacher" },
                    { id: 26, jp: "4人の英語の先生", answer: "four English teachers" },
                    { id: 27, jp: "12人の英語の先生", answer: "twelve English teachers" },
                    { id: 28, jp: "（1人の）サッカー選手", answer: "a soccer player" },
                    { id: 29, jp: "5人のサッカー選手", answer: "five soccer players" },
                    { id: 30, jp: "11人のサッカー選手", answer: "eleven soccer players" },
                    { id: 31, jp: "たくさんのサッカー選手", answer: "many soccer players" },
                    { id: 32, jp: "1杯の水", answer: "a glass of water" },
                    { id: 33, jp: "2杯の水", answer: "two glasses of water" },
                    { id: 34, jp: "20杯の水", answer: "twenty glasses of water" },
                    { id: 35, jp: "1杯のお茶", answer: "a cup of tea" },
                    { id: 36, jp: "15杯のお茶", answer: "fifteen cups of tea" },
                    { id: 37, jp: "50杯のお茶", answer: "fifty cups of tea" },
                    { id: 38, jp: "1枚の紙", answer: "a piece of paper" },
                    { id: 39, jp: "7枚の紙", answer: "seven pieces of paper" },
                    { id: 40, jp: "17枚の紙", answer: "seventeen pieces of paper" }
                ],
                fillInQuestions: [
                    { id: 1, translation: "わたしの車", prompt: "( ) car", answer: "my" },
                    { id: 2, translation: "あなたの家", prompt: "( ) house", answer: "your" },
                    { id: 3, translation: "彼のお父さん", prompt: "( ) father", answer: "his" },
                    { id: 4, translation: "彼女のペン", prompt: "( ) pen", answer: "her" },
                    { id: 5, translation: "私たちのチーム", prompt: "( ) team", answer: "our" },
                    { id: 6, translation: "彼らの自転車", prompt: "( ) bicycle", answer: "their" },
                    { id: 7, translation: "このノート", prompt: "( ) notebook", answer: "this" },
                    { id: 8, translation: "あの男の子", prompt: "( ) boy", answer: "that" },
                    { id: 9, translation: "わたしの古い家", prompt: "( )( ) house", answer: "my old" },
                    { id: 10, translation: "この新しい車", prompt: "( ) ( ) car", answer: "this new" },
                    { id: 11, translation: "(1つの) リンゴ", prompt: "( ) apple", answer: "an" },
                    { id: 12, translation: "1時間", prompt: "( ) hour", answer: "an" },
                    { id: 13, translation: "そのドア", prompt: "( ) door", answer: "the" },
                    { id: 14, translation: "(1冊の)本", prompt: "( ) book", answer: "a" },
                    { id: 15, translation: "そのイス", prompt: "( ) chair", answer: "the" },
                    { id: 16, translation: "その大きなカバン", prompt: "( ) ( ) bag", answer: "the big" },
                    { id: 17, translation: "(1人の)良い先生", prompt: "( ) ( ) teacher", answer: "a good" },
                    { id: 18, translation: "(1匹の)イヌ", prompt: "( ) dog", answer: "a" },
                    { id: 19, translation: "2匹のイヌ", prompt: "( )( )", answer: "two dogs" },
                    { id: 20, translation: "10匹のイヌ", prompt: "( )( )", answer: "ten dogs" },
                    { id: 21, translation: "(1戸の)家", prompt: "( )( )", answer: "a house" },
                    { id: 22, translation: "3戸の家", prompt: "( )( )", answer: "three houses" },
                    { id: 23, translation: "13戸の家", prompt: "( )( )", answer: "thirteen houses" },
                    { id: 24, translation: "たくさんの家", prompt: "( )( )", answer: "many houses" },
                    { id: 25, translation: "(1人の)英語の先生", prompt: "( )( )( )", answer: "an English teacher" },
                    { id: 26, translation: "4人の英語の先生", prompt: "( )( )( )", answer: "four English teachers" },
                    { id: 27, translation: "12人の英語の先生", prompt: "( )( )( )", answer: "twelve English teachers" },
                    { id: 28, translation: "(1人の)サッカー選手", prompt: "( )( )( )", answer: "a soccer player" },
                    { id: 29, translation: "5人のサッカー選手", prompt: "( )( )( )", answer: "five soccer players" },
                    { id: 30, translation: "11人のサッカー選手", prompt: "( )( )( )", answer: "eleven soccer players" },
                    { id: 31, translation: "たくさんのサッカー選手", prompt: "( )( )( )", answer: "many soccer players" },
                    { id: 32, translation: "1杯の水", prompt: "( )( )( )( )", answer: "a glass of water" },
                    { id: 33, translation: "2杯の水", prompt: "( )( )( )( )", answer: "two glasses of water" },
                    { id: 34, translation: "20杯の水", prompt: "( )( )( )( )", answer: "twenty glasses of water" },
                    { id: 35, translation: "1杯のお茶", prompt: "( )( )( )( )", answer: "a cup of tea" },
                    { id: 36, translation: "15杯のお茶", prompt: "( )( )( )( )", answer: "fifteen cups of tea" },
                    { id: 37, translation: "50杯のお茶", prompt: "( )( )( )( )", answer: "fifty cups of tea" },
                    { id: 38, translation: "1枚の紙", prompt: "( )( )( )( )", answer: "a piece of paper" },
                    { id: 39, translation: "7枚の紙", prompt: "( )( )( )( )", answer: "seven pieces of paper" },
                    { id: 40, translation: "17枚の紙", prompt: "( )( )( )( )", answer: "seventeen pieces of paper" }
                ],
                writingQuestions: [
                    { id: 1, jp: "わたしの車", answer: "my car" },
                    { id: 2, jp: "あなたの家", answer: "your house" },
                    { id: 3, jp: "彼のお父さん", answer: "his father" },
                    { id: 4, jp: "彼女のペン", answer: "her pen" },
                    { id: 5, jp: "私たちのチーム", answer: "our team" },
                    { id: 6, jp: "彼らの自転車", answer: "their bicycle" },
                    { id: 7, jp: "このノート", answer: "this notebook" },
                    { id: 8, jp: "あの男の子", answer: "that boy" },
                    { id: 9, jp: "わたしの古い家", answer: "my old house" },
                    { id: 10, jp: "この新しい車", answer: "this new car" },
                    { id: 11, jp: "（1つの）リンゴ", answer: "an apple" },
                    { id: 12, jp: "1時間", answer: "an hour" },
                    { id: 13, jp: "そのドア", answer: "the door" },
                    { id: 14, jp: "（1冊の）本", answer: "a book" },
                    { id: 15, jp: "そのイス", answer: "the chair" },
                    { id: 16, jp: "その大きなカバン", answer: "the big bag" },
                    { id: 17, jp: "（1人の）良い先生", answer: "a good teacher" },
                    { id: 18, jp: "（1匹の）イヌ", answer: "a dog" },
                    { id: 19, jp: "2匹のイヌ", answer: "two dogs" },
                    { id: 20, jp: "10匹のイヌ", answer: "ten dogs" },
                    { id: 21, jp: "（1戸の）家", answer: "a house" },
                    { id: 22, jp: "3戸の家", answer: "three houses" },
                    { id: 23, jp: "13戸の家", answer: "thirteen houses" },
                    { id: 24, jp: "たくさんの家", answer: "many houses" },
                    { id: 25, jp: "（1人の）英語の先生", answer: "an English teacher" },
                    { id: 26, jp: "4人の英語の先生", answer: "four English teachers" },
                    { id: 27, jp: "12人の英語の先生", answer: "twelve English teachers" },
                    { id: 28, jp: "（1人の）サッカー選手", answer: "a soccer player" },
                    { id: 29, jp: "5人のサッカー選手", answer: "five soccer players" },
                    { id: 30, jp: "11人のサッカー選手", answer: "eleven soccer players" },
                    { id: 31, jp: "たくさんのサッカー選手", answer: "many soccer players" },
                    { id: 32, jp: "1杯の水", answer: "a glass of water" },
                    { id: 33, jp: "2杯の水", answer: "two glasses of water" },
                    { id: 34, jp: "20杯の水", answer: "twenty glasses of water" },
                    { id: 35, jp: "1杯のお茶", answer: "a cup of tea" },
                    { id: 36, jp: "15杯のお茶", answer: "fifteen cups of tea" },
                    { id: 37, jp: "50杯のお茶", answer: "fifty cups of tea" },
                    { id: 38, jp: "1枚の紙", answer: "a piece of paper" },
                    { id: 39, jp: "7枚の紙", answer: "seven pieces of paper" },
                    { id: 40, jp: "17枚の紙", answer: "seventeen pieces of paper" }
                ],
                questions: []
            },
            {
                id: 2026022603,
                title: "代名詞",
                stepOrder: ['flashcard', 'writing', 'complete'],
                flashcards: [
                    { id: 1, front: "「代名詞」とはどのような言葉か？", back: "一度言った名詞の代わりをする（言い換える）言葉", hint: "名詞の言い換えです" },
                    { id: 2, front: "英語の主格（〜は、〜が）となる代名詞は全部で何個あるか？", back: "8個", hint: "I, you, he, she, it, we, you, they" },
                    { id: 3, front: "「私は」を英語で言うと？", back: "I", hint: "主語の I" },
                    { id: 4, front: "「あなたは」を英語で言うと？", back: "you", hint: "単数でも複数でも you" },
                    { id: 5, front: "「彼は」を英語で言うと？", back: "he", hint: "男性単数" },
                    { id: 6, front: "「彼女は」を英語で言うと？", back: "she", hint: "女性単数" },
                    { id: 7, front: "「それは」を英語で言うと？", back: "it", hint: "モノ・動物の単数" },
                    { id: 8, front: "「私たちは」を英語で言うと？", back: "we", hint: "I を含む複数" },
                    { id: 9, front: "「あなたたちは」を英語で言うと？", back: "you（「あなたは」と同じ形）", hint: "you は形が同じ" },
                    { id: 10, front: "「彼らは（彼女らは・それらは）」を英語で言うと？", back: "they", hint: "複数の主語" },
                    { id: 11, front: "名詞を代名詞に言い換えるとき、まず何を確認するか？", back: "単数（1つ）か、複数（2つ以上）か", hint: "まず数を判定します" },
                    { id: 12, front: "「an apple」を代名詞で言い換えると？", back: "it （単数で、人ではなくモノだから）", hint: "単数・モノ = it" },
                    { id: 13, front: "「the apple」を代名詞で言い換えると？", back: "it （単数で、人ではなくモノだから）", hint: "単数・モノ = it" },
                    { id: 14, front: "「apples」を代名詞で言い換えると？", back: "they （複数で、itの複数形にあたるから）", hint: "複数 = they" },
                    { id: 15, front: "「they」という代名詞は、人を表す「彼らは・彼女らは」という意味のほかに、どんな意味があるか？", back: "「それらは」（モノの複数形としても使う）", hint: "モノの複数にも使います" },
                    { id: 16, front: "「my desk」を代名詞で言い換えると？", back: "it （単数でモノだから）", hint: "desk 1つ = it" },
                    { id: 17, front: "「his desks」を代名詞で言い換えると？", back: "they （複数でモノだから）", hint: "desks 複数 = they" },
                    { id: 18, front: "「my brother」を代名詞で言い換えると？", back: "he （単数で男の人だから）", hint: "男性単数 = he" },
                    { id: 19, front: "「the woman」を代名詞で言い換えると？", back: "she （単数で女の人だから）", hint: "女性単数 = she" },
                    { id: 20, front: "「men」（manの複数形）を代名詞で言い換えると？", back: "they （複数の男の人だから）", hint: "複数 = they" },
                    { id: 21, front: "「women」（womanの複数形）を代名詞で言い換えると？", back: "they （複数の女の人だから）", hint: "複数 = they" },
                    { id: 22, front: "英語で「A and B」はどういう意味か？", back: "A と B", hint: "and = と" },
                    { id: 23, front: "「I and my friend（私と私の友達）」を代名詞で言い換えると？", back: "we （「私たち」になるから）", hint: "I を含む複数 = we" },
                    { id: 24, front: "「you and your friend（あなたとあなたの友達）」を代名詞で言い換えると？", back: "you （「あなたたち」になるから）", hint: "you 複数も you" },
                    { id: 25, front: "「he and she（彼と彼女）」を代名詞で言い換えると？", back: "they （「彼ら」になるから）", hint: "複数 = they" },
                    { id: 26, front: "英語の文で「絶対に欠かせないもの」は何か？", back: "主語（〜は、〜が）と動詞", hint: "主語 + 動詞が必須" },
                    { id: 27, front: "「雨です」や「2時です」という日本語には、何が欠けているか？", back: "主語（「〜は」にあたる言葉）", hint: "英語では主語が必要" },
                    { id: 28, front: "「雨です」「2時です」「日曜日です」など、主語がない文を英語にする時、座席を埋めるために無理やり置く主語は何か？", back: "it", hint: "形式主語 it" },
                    { id: 29, front: "天候や時間を表す時に置いた「it」は、日本語でどう訳すか？", back: "訳さなくていい（「それは〜」と訳すと不自然になるため）", hint: "日本語では訳さない it" },
                    { id: 30, front: "「雨です」を英語で言うと？", back: "It is rainy.", hint: "天気の it" },
                    { id: 31, front: "「2時です」を英語で言うと？", back: "It is two o'clock.", hint: "時間の it" },
                    { id: 32, front: "「日曜日です」を英語で言うと？", back: "It is Sunday.", hint: "曜日の it" },
                    { id: 33, front: "「4月25日です」を英語で言うと？", back: "It is April 25.", hint: "日付の it" },
                    { id: 34, front: "月曜日", back: "Monday", hint: "曜日" },
                    { id: 35, front: "火曜日", back: "Tuesday", hint: "曜日" },
                    { id: 36, front: "水曜日", back: "Wednesday", hint: "曜日" },
                    { id: 37, front: "木曜日", back: "Thursday", hint: "曜日" },
                    { id: 38, front: "金曜日", back: "Friday", hint: "曜日" },
                    { id: 39, front: "土曜日", back: "Saturday", hint: "曜日" },
                    { id: 40, front: "日曜日", back: "Sunday", hint: "曜日" },
                    { id: 41, front: "1月", back: "January", hint: "月" },
                    { id: 42, front: "2月", back: "February", hint: "月" },
                    { id: 43, front: "3月", back: "March", hint: "月" },
                    { id: 44, front: "4月", back: "April", hint: "月" },
                    { id: 45, front: "5月", back: "May", hint: "月" },
                    { id: 46, front: "6月", back: "June", hint: "月" },
                    { id: 47, front: "7月", back: "July", hint: "月" },
                    { id: 48, front: "8月", back: "August", hint: "月" },
                    { id: 49, front: "9月", back: "September", hint: "月" },
                    { id: 50, front: "10月", back: "October", hint: "月" },
                    { id: 51, front: "11月", back: "November", hint: "月" },
                    { id: 52, front: "12月", back: "December", hint: "月" }
                ],
                writingQuestions: [
                    { id: 1, jp: "「私は」を英語で言うと？", answer: "I" },
                    { id: 2, jp: "「あなたは」を英語で言うと？", answer: "you" },
                    { id: 3, jp: "「彼は」を英語で言うと？", answer: "he" },
                    { id: 4, jp: "「彼女は」を英語で言うと？", answer: "she" },
                    { id: 5, jp: "「それは」を英語で言うと？", answer: "it" },
                    { id: 6, jp: "「私たちは」を英語で言うと？", answer: "we" },
                    { id: 7, jp: "「あなたたちは」を英語で言うと？", answer: "you" },
                    { id: 8, jp: "「彼らは（彼女らは・それらは）」を英語で言うと？", answer: "they" },
                    { id: 9, jp: "「an apple」を代名詞で言い換えると？", answer: "it" },
                    { id: 10, jp: "「the apple」を代名詞で言い換えると？", answer: "it" },
                    { id: 11, jp: "「apples」を代名詞で言い換えると？", answer: "they" },
                    { id: 12, jp: "「my desk」を代名詞で言い換えると？", answer: "it" },
                    { id: 13, jp: "「his desks」を代名詞で言い換えると？", answer: "they" },
                    { id: 14, jp: "「my brother」を代名詞で言い換えると？", answer: "he" },
                    { id: 15, jp: "「the woman」を代名詞で言い換えると？", answer: "she" },
                    { id: 16, jp: "「men」（manの複数形）を代名詞で言い換えると？", answer: "they" },
                    { id: 17, jp: "「women」（womanの複数形）を代名詞で言い換えると？", answer: "they" },
                    { id: 18, jp: "英語で「A and B」はどういう意味か？", answer: "A と B" },
                    { id: 19, jp: "「I and my friend（私と私の友達）」を代名詞で言い換えると？", answer: "we" },
                    { id: 20, jp: "「you and your friend（あなたとあなたの友達）」を代名詞で言い換えると？", answer: "you" },
                    { id: 21, jp: "「he and she（彼と彼女）」を代名詞で言い換えると？", answer: "they" },
                    { id: 22, jp: "月曜日", answer: "Monday" },
                    { id: 23, jp: "火曜日", answer: "Tuesday" },
                    { id: 24, jp: "水曜日", answer: "Wednesday" },
                    { id: 25, jp: "木曜日", answer: "Thursday" },
                    { id: 26, jp: "金曜日", answer: "Friday" },
                    { id: 27, jp: "土曜日", answer: "Saturday" },
                    { id: 28, jp: "日曜日", answer: "Sunday" },
                    { id: 29, jp: "1月", answer: "January" },
                    { id: 30, jp: "2月", answer: "February" },
                    { id: 31, jp: "3月", answer: "March" },
                    { id: 32, jp: "4月", answer: "April" },
                    { id: 33, jp: "5月", answer: "May" },
                    { id: 34, jp: "6月", answer: "June" },
                    { id: 35, jp: "7月", answer: "July" },
                    { id: 36, jp: "8月", answer: "August" },
                    { id: 37, jp: "9月", answer: "September" },
                    { id: 38, jp: "10月", answer: "October" },
                    { id: 39, jp: "11月", answer: "November" },
                    { id: 40, jp: "12月", answer: "December" },
                    { id: 41, jp: "「雨です」を英語で言うと？", answer: "It is rainy." },
                    { id: 42, jp: "「2時です」を英語で言うと？", answer: "It is two o'clock." },
                    { id: 43, jp: "「日曜日です」を英語で言うと？", answer: "It is Sunday." },
                    { id: 44, jp: "「4月25日です」を英語で言うと？", answer: "It is April 25." }
                ],
                questions: []
            },
            {
                id: 2026022604,
                title: "be動詞(現在形の肯定文)",
                stepOrder: ['flashcard', 'error', 'sort', 'instant', 'writing', 'complete'],
                flashcards: [
                    { id: 1, front: "英語の語順は何種類ある？", back: "2種類「です文」と「する文」", hint: "文の型は2つ" },
                    { id: 2, front: "英語の語順の1種類目は？", back: "「です文」：だれが → です → 〜(ニョロ) → 所 → 状 → 時", hint: "be動詞の文" },
                    { id: 3, front: "英語の語順の2種類目は？", back: "「する文」：だれが → する → だれ・なに → 所 → 状 → 時", hint: "一般動詞の文" },
                    { id: 4, front: "「です文」に使う動詞は？", back: "be動詞", hint: "am/is/are" },
                    { id: 5, front: "be動詞の意味を2つ答えてください", back: "「＝（同じ・状態）」と「いる/ある（存在）」", hint: "イコールと存在" },
                    { id: 6, front: "「する文」に使う動詞は？", back: "一般動詞", hint: "play, like など" },
                    { id: 7, front: "一般動詞の意味は？", back: "（習慣的に行う）動作、（相手に対する）気持ち、考え", hint: "行動・感情・思考" },
                    { id: 8, front: "「私は走る」は「する」文？「です」文？", back: "「する文」", hint: "run は一般動詞" },
                    { id: 9, front: "「私は学生だ」は「する」文？「です」文？", back: "「です文」", hint: "I am a student." },
                    { id: 10, front: "「私は眠い」は「する」文？「です」文？", back: "「です文」", hint: "I am sleepy." },
                    { id: 11, front: "「私は学校にいる」は「する」文？「です」文？", back: "「です文」", hint: "存在の be動詞" },
                    { id: 12, front: "「私は学生だ」は「する」文？「です」文？", back: "「です文」", hint: "重ねて確認" },
                    { id: 13, front: "「私は先生です」は「＝（同じ・状態）」タイプ？「存在」タイプ？", back: "＝（同じ・状態）", hint: "I = teacher の関係" },
                    { id: 14, front: "「私はうれしいです」は「＝（同じ・状態）」タイプ？「存在」タイプ？", back: "＝（同じ・状態）", hint: "主語の状態説明" },
                    { id: 15, front: "「私は公園にいます」は「＝（同じ・状態）」タイプ？「存在」タイプ？", back: "存在タイプ", hint: "場所に存在" },
                    { id: 16, front: "「彼は先生だ」は「＝」タイプ？「存在」タイプ？", back: "＝（同じ・状態）", hint: "He = teacher" },
                    { id: 17, front: "「彼は学校にいる」は「＝」タイプ？「存在」タイプ？", back: "存在タイプ", hint: "場所の存在" },
                    { id: 18, front: "「彼らは元気だ」は「＝」タイプ？「存在」タイプ？", back: "＝（同じ・状態）", hint: "状態説明" },
                    { id: 19, front: "be動詞を3つに変化します。何でしょうか？", back: "am,is,are", hint: "主語で変化" },
                    { id: 20, front: "be動詞のルールは？", back: "be動詞は主語によって変わる", hint: "主語一致" },
                    { id: 21, front: "主語がIの時はbe動詞は何に変わる？", back: "am", hint: "I am" },
                    { id: 22, front: "amは主語がどんな時に使う？", back: "I", hint: "I 専用" },
                    { id: 23, front: "主語がYouや複数の時に、be動詞は何に変わる？", back: "are", hint: "You/複数 = are" },
                    { id: 24, front: "areは主語がどんな時に使う？", back: "複数とYou", hint: "we/you/they + are" },
                    { id: 25, front: "主語がIとYou以外の単数の時に、be動詞は何に変わる？", back: "is", hint: "he/she/it + is" },
                    { id: 26, front: "isは主語がどんな時に使う？", back: "IとYou以外の単数", hint: "単数3人称など" },
                    { id: 27, front: "固有名詞を書く時、必ず最初の文字をどうする？", back: "大文字で書く", hint: "Tom, Japan など" },
                    { id: 28, front: "普通の名詞は「丸裸（単体）」で使うことができる？", back: "できない。\na/anを前につけたり、複数形のsを後ろにつけたりする必要がある", hint: "a book / books のように使う" },
                    { id: 29, front: "「雨です」や「2時です」という日本語には、何が欠けているか？", back: "主語（「〜は」にあたる言葉）", hint: "英語では主語が必要" },
                    { id: 30, front: "「雨です」「2時です」「日曜日です」など、主語がない文を英語にする時、座席を埋めるために無理やり置く主語は何か？", back: "it", hint: "形式主語 it" },
                    { id: 31, front: "天候や時間を表す時に置いた「it」は、日本語でどう訳すか？", back: "訳さなくていい（「それは〜」と訳すと不自然になるため）", hint: "訳さない it" },
                    { id: 32, front: "「雨です」を英語で言うと？", back: "It is rainy.", hint: "天候表現" },
                    { id: 33, front: "「2時です」を英語で言うと？", back: "It is two o'clock.", hint: "時刻表現" },
                    { id: 34, front: "「日曜日です」を英語で言うと？", back: "It is Sunday.", hint: "曜日表現" },
                    { id: 35, front: "「4月25日です」を英語で言うと？", back: "It is April 25.", hint: "日付表現" },
                    { id: 36, front: "月曜日", back: "Monday", hint: "曜日" },
                    { id: 37, front: "火曜日", back: "Tuesday", hint: "曜日" },
                    { id: 38, front: "水曜日", back: "Wednesday", hint: "曜日" },
                    { id: 39, front: "木曜日", back: "Thursday", hint: "曜日" },
                    { id: 40, front: "金曜日", back: "Friday", hint: "曜日" },
                    { id: 41, front: "土曜日", back: "Saturday", hint: "曜日" },
                    { id: 42, front: "日曜日", back: "Sunday", hint: "曜日" },
                    { id: 43, front: "1月", back: "January", hint: "月" },
                    { id: 44, front: "2月", back: "February", hint: "月" },
                    { id: 45, front: "3月", back: "March", hint: "月" },
                    { id: 46, front: "4月", back: "April", hint: "月" },
                    { id: 47, front: "5月", back: "May", hint: "月" },
                    { id: 48, front: "6月", back: "June", hint: "月" },
                    { id: 49, front: "7月", back: "July", hint: "月" },
                    { id: 50, front: "8月", back: "August", hint: "月" },
                    { id: 51, front: "9月", back: "September", hint: "月" },
                    { id: 52, front: "10月", back: "October", hint: "月" },
                    { id: 53, front: "11月", back: "November", hint: "月" },
                    { id: 54, front: "12月", back: "December", hint: "月" }
                ],
                errorQuestions: [
                    { id: 1, original: "I is student.", error: { part: 'does', wrong: "is", correct: "am", sentenceParts: { who: "I", does: "is", what: "student" } } },
                    { id: 2, original: "You is Tom.", error: { part: 'does', wrong: "is", correct: "are", sentenceParts: { who: "You", does: "is", what: "Tom" } } },
                    { id: 3, original: "He are busy.", error: { part: 'does', wrong: "are", correct: "is", sentenceParts: { who: "He", does: "are", what: "busy" } } },
                    { id: 4, original: "It are an apple.", error: { part: 'does', wrong: "are", correct: "is", sentenceParts: { who: "It", does: "are", what: "an apple" } } },
                    { id: 5, original: "She are kind.", error: { part: 'does', wrong: "are", correct: "is", sentenceParts: { who: "She", does: "are", what: "kind" } } },
                    { id: 6, original: "This are a pen.", error: { part: 'does', wrong: "are", correct: "is", sentenceParts: { who: "This", does: "are", what: "a pen" } } },
                    { id: 7, original: "The dog are Bob.", error: { part: 'does', wrong: "are", correct: "is", sentenceParts: { who: "The dog", does: "are", what: "Bob" } } },
                    { id: 8, original: "We is doctor.", error: { part: 'does', wrong: "is", correct: "are", sentenceParts: { who: "We", does: "is", what: "doctor" } } },
                    { id: 9, original: "You am teachers.", error: { part: 'does', wrong: "am", correct: "are", sentenceParts: { who: "You", does: "am", what: "teachers" } } },
                    { id: 10, original: "They is friends.", error: { part: 'does', wrong: "is", correct: "are", sentenceParts: { who: "They", does: "is", what: "friends" } } },
                    { id: 11, original: "I are from Japan.", error: { part: 'does', wrong: "are", correct: "am", sentenceParts: { who: "I", does: "are", what: "from Japan" } } },
                    { id: 12, original: "She and he is happy.", error: { part: 'does', wrong: "is", correct: "are", sentenceParts: { who: "She and he", does: "is", what: "happy" } } },
                    { id: 13, original: "My mother are happy.", error: { part: 'does', wrong: "are", correct: "is", sentenceParts: { who: "My mother", does: "are", what: "happy" } } },
                    { id: 14, original: "My mother and your brother is happy.", error: { part: 'does', wrong: "is", correct: "are", sentenceParts: { who: "My mother and your brother", does: "is", what: "happy" } } }
                ],
                questions: [
                    {
                        id: 1, original: "私は学生です。", translation: "I am a student.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "です", en: "am" }, what: { jp: "学生", en: "a student" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "学生", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "am", category: 'does' }, { id: 'e3', text: "a student", category: 'what' }]
                    },
                    {
                        id: 2, original: "あなたはトムです。", translation: "You are Tom.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あなたは", en: "You" }, does: { jp: "です", en: "are" }, what: { jp: "トム", en: "Tom" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あなたは", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "トム", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "You", category: 'who' }, { id: 'e2', text: "are", category: 'does' }, { id: 'e3', text: "Tom", category: 'what' }]
                    },
                    {
                        id: 3, original: "彼は忙しい。", translation: "He is busy.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼は", en: "He" }, does: { jp: "です", en: "is" }, what: { jp: "忙しい", en: "busy" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "忙しい", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "He", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "busy", category: 'what' }]
                    },
                    {
                        id: 4, original: "それはリンゴです。", translation: "It is an apple.",
                        rows: [{ id: 'm1', structure: { who: { jp: "それは", en: "It" }, does: { jp: "です", en: "is" }, what: { jp: "リンゴ", en: "an apple" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "それは", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "リンゴ", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "It", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "an apple", category: 'what' }]
                    },
                    {
                        id: 5, original: "彼女は親切だ。", translation: "She is kind.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼女は", en: "She" }, does: { jp: "です", en: "is" }, what: { jp: "親切だ", en: "kind" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼女は", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "親切だ", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "She", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "kind", category: 'what' }]
                    },
                    {
                        id: 6, original: "これはペンです。", translation: "This is a pen.",
                        rows: [{ id: 'm1', structure: { who: { jp: "これは", en: "This" }, does: { jp: "です", en: "is" }, what: { jp: "ペン", en: "a pen" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "これは", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "ペン", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "This", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "a pen", category: 'what' }]
                    },
                    {
                        id: 7, original: "あの犬はボブです。", translation: "That dog is Bob.",
                        rows: [{ id: 'm1', structure: { who: { jp: "その犬は", en: "That dog" }, does: { jp: "です", en: "is" }, what: { jp: "ボブ", en: "Bob" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "その犬は", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "ボブ", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "That dog", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "Bob", category: 'what' }]
                    },
                    {
                        id: 8, original: "私たちは医者です。", translation: "We are doctors.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私たちは", en: "We" }, does: { jp: "です", en: "are" }, what: { jp: "医者", en: "doctors" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私たちは", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "医者", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "We", category: 'who' }, { id: 'e2', text: "are", category: 'does' }, { id: 'e3', text: "doctors", category: 'what' }]
                    },
                    {
                        id: 9, original: "あなたたちは先生です。", translation: "You are teachers.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あなたたちは", en: "You" }, does: { jp: "です", en: "are" }, what: { jp: "先生", en: "teachers" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あなたたちは", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "先生", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "You", category: 'who' }, { id: 'e2', text: "are", category: 'does' }, { id: 'e3', text: "teachers", category: 'what' }]
                    },
                    {
                        id: 10, original: "彼らは友達です。", translation: "They are friends.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼らは", en: "They" }, does: { jp: "です", en: "are" }, what: { jp: "友達", en: "friends" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼らは", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "友達", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "They", category: 'who' }, { id: 'e2', text: "are", category: 'does' }, { id: 'e3', text: "friends", category: 'what' }]
                    },
                    {
                        id: 11, original: "こちらはアキラです。", translation: "This is Akira.",
                        rows: [{ id: 'm1', structure: { who: { jp: "こちらは", en: "This" }, does: { jp: "です", en: "is" }, what: { jp: "アキラ", en: "Akira" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "こちらは", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "アキラ", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "This", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "Akira", category: 'what' }]
                    },
                    {
                        id: 12, original: "あれは本です。", translation: "That is a book.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あれは", en: "That" }, does: { jp: "です", en: "is" }, what: { jp: "本", en: "a book" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あれは", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "本", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "That", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "a book", category: 'what' }]
                    },
                    {
                        id: 13, original: "私は日本出身です。", translation: "I am from Japan.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "です", en: "am" }, what: { jp: "日本出身", en: "from Japan" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "日本出身", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "am", category: 'does' }, { id: 'e3', text: "from Japan", category: 'what' }]
                    },
                    {
                        id: 14, original: "私はスズキケンです。", translation: "I am Ken Suzuki.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "です", en: "am" }, what: { jp: "スズキケン", en: "Ken Suzuki" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "スズキケン", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "am", category: 'does' }, { id: 'e3', text: "Ken Suzuki", category: 'what' }]
                    },
                    {
                        id: 15, original: "彼らは学生です。", translation: "They are students.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼らは", en: "They" }, does: { jp: "です", en: "are" }, what: { jp: "学生", en: "students" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼らは", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "学生", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "They", category: 'who' }, { id: 'e2', text: "are", category: 'does' }, { id: 'e3', text: "students", category: 'what' }]
                    }
                ],
                instantQuestions: [
                    { id: 1, jp: "私は学生です。", answer: "I am a student." },
                    { id: 2, jp: "あなたはトムです。", answer: "You are Tom." },
                    { id: 3, jp: "彼は忙しい。", answer: "He is busy." },
                    { id: 4, jp: "それはリンゴです。", answer: "It is an apple." },
                    { id: 5, jp: "彼女は親切だ。", answer: "She is kind." },
                    { id: 6, jp: "これはペンです。", answer: "This is a pen." },
                    { id: 7, jp: "あの犬はボブです。", answer: "That dog is Bob." },
                    { id: 8, jp: "私たちは医者です。", answer: "We are doctors." },
                    { id: 9, jp: "あなたたちは先生です。", answer: "You are teachers." },
                    { id: 10, jp: "彼らは友達です。", answer: "They are friends." },
                    { id: 11, jp: "こちらはアキラです。", answer: "This is Akira." },
                    { id: 12, jp: "あれは本です。", answer: "That is a book." },
                    { id: 13, jp: "私は日本出身です。", answer: "I am from Japan." },
                    { id: 14, jp: "私はスズキケンです。", answer: "I am Ken Suzuki." },
                    { id: 15, jp: "彼らは学生です。", answer: "They are students." }
                ],
                writingQuestions: [
                    { id: 1, jp: "私は学生です。", answer: "I am a student." },
                    { id: 2, jp: "あなたはトムです。", answer: "You are Tom." },
                    { id: 3, jp: "彼は忙しい。", answer: "He is busy." },
                    { id: 4, jp: "それはリンゴです。", answer: "It is an apple." },
                    { id: 5, jp: "彼女は親切だ。", answer: "She is kind." },
                    { id: 6, jp: "これはペンです。", answer: "This is a pen." },
                    { id: 7, jp: "あの犬はボブです。", answer: "That dog is Bob." },
                    { id: 8, jp: "私たちは医者です。", answer: "We are doctors." },
                    { id: 9, jp: "あなたたちは先生です。", answer: "You are teachers." },
                    { id: 10, jp: "彼らは友達です。", answer: "They are friends." },
                    { id: 11, jp: "こちらはアキラです。", answer: "This is Akira." },
                    { id: 12, jp: "あれは本です。", answer: "That is a book." },
                    { id: 13, jp: "私は日本出身です。", answer: "I am from Japan." },
                    { id: 14, jp: "私はスズキケンです。", answer: "I am Ken Suzuki." },
                    { id: 15, jp: "彼らは学生です。", answer: "They are students." }
                ]
            },
            {
                id: 2026022605,
                title: "一般動詞(現在形の肯定文)",
                stepOrder: ['flashcard', 'error', 'sort', 'instant', 'writing', 'complete'],
                flashcards: [
                    { id: 1, front: "英語の語順は何種類ある？", back: "2種類「です文」と「する文」", hint: "文の型は2つ" },
                    { id: 2, front: "英語の語順の1種類目は？", back: "「です文」：だれが → です → 〜(ニョロ)→ 所 → 状→時", hint: "be動詞の文" },
                    { id: 3, front: "英語の語順の2種類目は？", back: "「する文」：だれが → する→ だれ・なに →  所 → 状→時", hint: "一般動詞の文" },
                    { id: 4, front: "「です文」に使う動詞は？", back: "be動詞", hint: "am/is/are" },
                    { id: 5, front: "be動詞の意味を2つ答えてください", back: "「＝（同じ・状態）」と「いる/ある（存在）」", hint: "イコールと存在" },
                    { id: 6, front: "「する文」に使う動詞は？", back: "一般動詞", hint: "play, like, have など" },
                    { id: 7, front: "一般動詞の意味は？", back: "（習慣的に行う）動作、（相手に対する）気持ち、考え", hint: "動作・気持ち・考え" },
                    { id: 8, front: "「私は走る」は「する」文？「です」文？", back: "「する文」", hint: "run は一般動詞" },
                    { id: 9, front: "一般動詞のルールは？", back: "be動詞と同じように、主語によって形が変わる", hint: "主語一致が必要" },
                    { id: 10, front: "主語がIとYou以外の単数の時、一般動詞の形はどう変わる？", back: "一般動詞にsやesをつける", hint: "三単現の s/es" },
                    { id: 11, front: "一般動詞にsやesをつける時はどんなとき？", back: "主語がIとYou以外の単数の時", hint: "he/she/it など" },
                    { id: 12, front: "一般動詞にesをつける時のルールは？", back: "語尾がs, sh, ch, x, oの時", hint: "watch, go など" },
                    { id: 13, front: "『watch』に三単現のsをつけるとどうなる？またその理由は？", back: "watches （語尾がs, sh, ch, x, oの時は「es」をつけるから）", hint: "watch -> watches" },
                    { id: 14, front: "『study』に三単現のsをつけるとどうなる？またその理由は？", back: "studies （語尾が子音字＋yの時は、yを「i」に変えて「es」をつけるから）", hint: "study -> studies" },
                    { id: 15, front: "『have』に三単現のsをつけるとどうなる？", back: "has （これだけは不規則変化！）", hint: "have -> has" },
                    { id: 16, front: "「ピアノを弾く」など、楽器を演奏すると言うとき、楽器の前に必ずつけるものは何？", back: "the （play the piano）", hint: "楽器は the をつける" },
                    { id: 17, front: "「サッカーをする」など、スポーツをすると言うとき、スポーツの前に冠詞（a, the）はつける？", back: "つけない（裸のまま）。スポーツには決まった形がないため。", hint: "play soccer" },
                    { id: 18, front: "「English」「Japanese」など、言語を英語で書くときの絶対ルールは？", back: "先頭を大文字にする（そして冠詞はつけない）", hint: "English, Japanese" }
                ],
                errorQuestions: [
                    { id: 1, original: "You plays the piano.", error: { part: 'does', wrong: "plays", correct: "play", sentenceParts: { who: "You", does: "plays", what: "the piano" } } },
                    { id: 2, original: "We plays soccer.", error: { part: 'does', wrong: "plays", correct: "play", sentenceParts: { who: "We", does: "plays", what: "soccer" } } },
                    { id: 3, original: "He speak Japanese.", error: { part: 'does', wrong: "speak", correct: "speaks", sentenceParts: { who: "He", does: "speak", what: "Japanese" } } },
                    { id: 4, original: "Our mother eat lunch.", error: { part: 'does', wrong: "eat", correct: "eats", sentenceParts: { who: "Our mother", does: "eat", what: "lunch" } } },
                    { id: 5, original: "My students watches TV.", error: { part: 'does', wrong: "watches", correct: "watch", sentenceParts: { who: "My students", does: "watches", what: "TV" } } },
                    { id: 6, original: "Their father writes a letter.", error: { part: 'does', wrong: "write", correct: "writes", sentenceParts: { who: "Their father", does: "write", what: "a letter" } } },
                    { id: 7, original: "The sun rise.", error: { part: 'does', wrong: "rise", correct: "rises", sentenceParts: { who: "The sun", does: "rise" } } },
                    { id: 8, original: "Her brothers likes baseball.", error: { part: 'does', wrong: "likes", correct: "like", sentenceParts: { who: "Her brothers", does: "likes", what: "baseball" } } },
                    { id: 9, original: "Your friend have two sisters.", error: { part: 'does', wrong: "have", correct: "has", sentenceParts: { who: "Your friend", does: "have", what: "two sisters" } } },
                    { id: 10, original: "Their brothers play soccer.", error: { part: 'does', wrong: "plays", correct: "play", sentenceParts: { who: "Their brothers", does: "plays", what: "soccer" } } },
                    { id: 11, original: "I likes apples.", error: { part: 'does', wrong: "likes", correct: "like", sentenceParts: { who: "I", does: "likes", what: "apples" } } },
                    { id: 12, original: "He like apples.", error: { part: 'does', wrong: "like", correct: "likes", sentenceParts: { who: "He", does: "like", what: "apples" } } },
                    { id: 13, original: "She haves a racket.", error: { part: 'does', wrong: "haves", correct: "has", sentenceParts: { who: "She", does: "haves", what: "a racket" } } },
                    { id: 14, original: "My mother and your brother likes oranges.", error: { part: 'does', wrong: "likes", correct: "like", sentenceParts: { who: "My mother and your brother", does: "likes", what: "oranges" } } },
                    { id: 15, original: "He and she likes apples.", error: { part: 'does', wrong: "likes", correct: "like", sentenceParts: { who: "He and she", does: "likes", what: "apples" } } }
                ],
                questions: [
                    {
                        id: 1, original: "私は犬を飼っている。", translation: "I have a dog.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "飼っている", en: "have" }, what: { jp: "犬を", en: "a dog" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "飼っている", category: 'does' }, { id: 'j3', text: "犬を", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "have", category: 'does' }, { id: 'e3', text: "a dog", category: 'what' }]
                    },
                    {
                        id: 2, original: "あなたはピアノを弾く。", translation: "You play the piano.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あなたは", en: "You" }, does: { jp: "弾く", en: "play" }, what: { jp: "ピアノを", en: "the piano" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あなたは", category: 'who' }, { id: 'j2', text: "弾く", category: 'does' }, { id: 'j3', text: "ピアノを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "You", category: 'who' }, { id: 'e2', text: "play", category: 'does' }, { id: 'e3', text: "the piano", category: 'what' }]
                    },
                    {
                        id: 3, original: "私たちはサッカーをする。", translation: "We play soccer.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私たちは", en: "We" }, does: { jp: "する", en: "play" }, what: { jp: "サッカーを", en: "soccer" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私たちは", category: 'who' }, { id: 'j2', text: "する", category: 'does' }, { id: 'j3', text: "サッカーを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "We", category: 'who' }, { id: 'e2', text: "play", category: 'does' }, { id: 'e3', text: "soccer", category: 'what' }]
                    },
                    {
                        id: 4, original: "彼は日本語を話す。", translation: "He speaks Japanese.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼は", en: "He" }, does: { jp: "話す", en: "speaks" }, what: { jp: "日本語を", en: "Japanese" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "話す", category: 'does' }, { id: 'j3', text: "日本語を", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "He", category: 'who' }, { id: 'e2', text: "speaks", category: 'does' }, { id: 'e3', text: "Japanese", category: 'what' }]
                    },
                    {
                        id: 5, original: "私たちの母は昼食を食べる。", translation: "Our mother eats lunch.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私たちの母は", en: "Our mother" }, does: { jp: "食べる", en: "eats" }, what: { jp: "昼食を", en: "lunch" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私たちの母は", category: 'who' }, { id: 'j2', text: "食べる", category: 'does' }, { id: 'j3', text: "昼食を", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "Our mother", category: 'who' }, { id: 'e2', text: "eats", category: 'does' }, { id: 'e3', text: "lunch", category: 'what' }]
                    },
                    {
                        id: 6, original: "私の生徒たちはテレビを見る。", translation: "My students watch TV.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私の生徒たちは", en: "My students" }, does: { jp: "見る", en: "watch" }, what: { jp: "テレビを", en: "TV" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私の生徒たちは", category: 'who' }, { id: 'j2', text: "見る", category: 'does' }, { id: 'j3', text: "テレビを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "My students", category: 'who' }, { id: 'e2', text: "watch", category: 'does' }, { id: 'e3', text: "TV", category: 'what' }]
                    },
                    {
                        id: 7, original: "彼らの父は手紙を書く。", translation: "Their father writes a letter.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼らの父は", en: "Their father" }, does: { jp: "書く", en: "writes" }, what: { jp: "手紙を", en: "a letter" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼らの父は", category: 'who' }, { id: 'j2', text: "書く", category: 'does' }, { id: 'j3', text: "手紙を", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "Their father", category: 'who' }, { id: 'e2', text: "writes", category: 'does' }, { id: 'e3', text: "a letter", category: 'what' }]
                    },
                    {
                        id: 8, original: "日が昇る。", translation: "The sun rises.",
                        rows: [{ id: 'm1', structure: { who: { jp: "日が", en: "The sun" }, does: { jp: "昇る", en: "rises" }, what: null, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "日が", category: 'who' }, { id: 'j2', text: "昇る", category: 'does' }],
                        enOptions: [{ id: 'e1', text: "The sun", category: 'who' }, { id: 'e2', text: "rises", category: 'does' }]
                    },
                    {
                        id: 9, original: "彼女の兄は野球が好きだ。", translation: "Her brother likes baseball.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼女の兄は", en: "Her brother" }, does: { jp: "好きだ", en: "likes" }, what: { jp: "野球が", en: "baseball" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼女の兄は", category: 'who' }, { id: 'j2', text: "好きだ", category: 'does' }, { id: 'j3', text: "野球が", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "Her brother", category: 'who' }, { id: 'e2', text: "likes", category: 'does' }, { id: 'e3', text: "baseball", category: 'what' }]
                    },
                    {
                        id: 10, original: "あなたの友達には姉が二人いる。", translation: "Your friend has two sisters.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あなたの友達には", en: "Your friend" }, does: { jp: "いる", en: "has" }, what: { jp: "姉が二人", en: "two sisters" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あなたの友達には", category: 'who' }, { id: 'j2', text: "いる", category: 'does' }, { id: 'j3', text: "姉が二人", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "Your friend", category: 'who' }, { id: 'e2', text: "has", category: 'does' }, { id: 'e3', text: "two sisters", category: 'what' }]
                    },
                    {
                        id: 11, original: "彼らの弟たちはサッカーをする。", translation: "Their brothers play soccer.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼らの弟たちは", en: "Their brothers" }, does: { jp: "する", en: "play" }, what: { jp: "サッカーを", en: "soccer" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼らの弟たちは", category: 'who' }, { id: 'j2', text: "する", category: 'does' }, { id: 'j3', text: "サッカーを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "Their brothers", category: 'who' }, { id: 'e2', text: "play", category: 'does' }, { id: 'e3', text: "soccer", category: 'what' }]
                    },
                    {
                        id: 12, original: "私はリンゴが好きだ。", translation: "I like apples.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "好きだ", en: "like" }, what: { jp: "リンゴが", en: "apples" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "好きだ", category: 'does' }, { id: 'j3', text: "リンゴが", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "like", category: 'does' }, { id: 'e3', text: "apples", category: 'what' }]
                    },
                    {
                        id: 13, original: "彼はリンゴが好きだ。", translation: "He likes apples.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼は", en: "He" }, does: { jp: "好きだ", en: "likes" }, what: { jp: "リンゴが", en: "apples" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "好きだ", category: 'does' }, { id: 'j3', text: "リンゴが", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "He", category: 'who' }, { id: 'e2', text: "likes", category: 'does' }, { id: 'e3', text: "apples", category: 'what' }]
                    },
                    {
                        id: 14, original: "彼女はラケットを持っている。", translation: "She has a racket.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼女は", en: "She" }, does: { jp: "持っている", en: "has" }, what: { jp: "ラケットを", en: "a racket" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼女は", category: 'who' }, { id: 'j2', text: "持っている", category: 'does' }, { id: 'j3', text: "ラケットを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "She", category: 'who' }, { id: 'e2', text: "has", category: 'does' }, { id: 'e3', text: "a racket", category: 'what' }]
                    },
                    {
                        id: 15, original: "あなたはオレンジが好きだ。", translation: "You like oranges.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あなたは", en: "You" }, does: { jp: "好きだ", en: "like" }, what: { jp: "オレンジが", en: "oranges" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あなたは", category: 'who' }, { id: 'j2', text: "好きだ", category: 'does' }, { id: 'j3', text: "オレンジが", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "You", category: 'who' }, { id: 'e2', text: "like", category: 'does' }, { id: 'e3', text: "oranges", category: 'what' }]
                    }
                ],
                instantQuestions: [
                    { id: 1, jp: "私は犬を飼っている。", answer: "I have a dog." },
                    { id: 2, jp: "あなたはピアノを弾く。", answer: "You play the piano." },
                    { id: 3, jp: "私たちはサッカーをする。", answer: "We play soccer." },
                    { id: 4, jp: "彼は日本語を話す。", answer: "He speaks Japanese." },
                    { id: 5, jp: "私たちの母は昼食を食べる。", answer: "Our mother eats lunch." },
                    { id: 6, jp: "私の生徒たちはテレビを見る。", answer: "My students watch TV." },
                    { id: 7, jp: "彼らの父は手紙を書く。", answer: "Their father writes a letter." },
                    { id: 8, jp: "日が昇る。", answer: "The sun rises." },
                    { id: 9, jp: "彼女の兄は野球が好きだ。", answer: "Her brother likes baseball." },
                    { id: 10, jp: "あなたの友達には姉が二人いる。", answer: "Your friend has two sisters." },
                    { id: 11, jp: "彼らの弟たちはサッカーをする。", answer: "Their brothers play soccer." },
                    { id: 12, jp: "私はリンゴが好きだ。", answer: "I like apples." },
                    { id: 13, jp: "彼はリンゴが好きだ。", answer: "He likes apples." },
                    { id: 14, jp: "彼女はラケットを持っている。", answer: "She has a racket." },
                    { id: 15, jp: "あなたはオレンジが好きだ。", answer: "You like oranges." }
                ],
                writingQuestions: [
                    { id: 1, jp: "私は犬を飼っている。", answer: "I have a dog." },
                    { id: 2, jp: "あなたはピアノを弾く。", answer: "You play the piano." },
                    { id: 3, jp: "私たちはサッカーをする。", answer: "We play soccer." },
                    { id: 4, jp: "彼は日本語を話す。", answer: "He speaks Japanese." },
                    { id: 5, jp: "私たちの母は昼食を食べる。", answer: "Our mother eats lunch." },
                    { id: 6, jp: "私の生徒たちはテレビを見る。", answer: "My students watch TV." },
                    { id: 7, jp: "彼らの父は手紙を書く。", answer: "Their father writes a letter." },
                    { id: 8, jp: "日が昇る。", answer: "The sun rises." },
                    { id: 9, jp: "彼女の兄は野球が好きだ。", answer: "Her brother likes baseball." },
                    { id: 10, jp: "あなたの友達には姉が二人いる。", answer: "Your friend has two sisters." },
                    { id: 11, jp: "彼らの弟たちはサッカーをする。", answer: "Their brothers play soccer." },
                    { id: 12, jp: "私はリンゴが好きだ。", answer: "I like apples." },
                    { id: 13, jp: "彼はリンゴが好きだ。", answer: "He likes apples." },
                    { id: 14, jp: "彼女はラケットを持っている。", answer: "She has a racket." },
                    { id: 15, jp: "あなたはオレンジが好きだ。", answer: "You like oranges." }
                ]
            },
            {
                id: 2026022606,
                title: "代名詞(主格・目的格)",
                stepOrder: ['flashcard', 'error', 'sort', 'instant', 'writing', 'complete'],
                flashcards: [
                    { id: 1, front: "代名詞とは何？", back: "名詞の代わりに使う語", hint: "名詞の言い換え" },
                    { id: 2, front: "代名詞を使う主な理由は？", back: "同じ名詞のくり返しを避けるため", hint: "繰り返しを防ぐ" },
                    { id: 3, front: "英語の語順で「だれが（主語）」に置く代名詞を何という？", back: "主格", hint: "主語に置く形" },
                    { id: 4, front: "英語の語順で「だれを／なにを（目的語）」に置く代名詞を何という？", back: "目的格", hint: "目的語に置く形" },
                    { id: 5, front: "「だれの＋名詞」にする代名詞を何という？", back: "所有格（形容詞的所有格）", hint: "名詞の前に置く" },
                    { id: 6, front: "だれのものを表す代名詞を何というか？", back: "所有代名詞", hint: "名詞なしで使う" },
                    { id: 7, front: "主格（だれが）の代名詞を7つ言ってください", back: "I / you / he / she / it / we / they", hint: "主語形" },
                    { id: 8, front: "目的格（だれを・なにを）の代名詞を7つ言ってください", back: "me / you / him / her / it / us / them", hint: "目的語形" },
                    { id: 9, front: "所有格（だれの＋名詞）の代名詞を7つ言ってください", back: "my / your / his / her / its / our / their", hint: "名詞を後ろに置く" },
                    { id: 10, front: "所有代名詞を6つ言ってください", back: "mine / yours / his / hers / ours / theirs", hint: "名詞なしで完結" },
                    { id: 11, front: "「私（だれが）」は？", back: "I", hint: "主格" },
                    { id: 12, front: "「あなた（だれが）」は？", back: "you", hint: "主格" },
                    { id: 13, front: "「彼（だれが）」は？", back: "he", hint: "主格" },
                    { id: 14, front: "「彼女（だれが）」は？", back: "she", hint: "主格" },
                    { id: 15, front: "「それ（だれが）」は？", back: "it", hint: "主格" },
                    { id: 16, front: "「私たち（だれが）」は？", back: "we", hint: "主格" },
                    { id: 17, front: "「彼ら（だれが）」は？", back: "they", hint: "主格" },
                    { id: 18, front: "「私を（だれを）」は？", back: "me", hint: "目的格" },
                    { id: 19, front: "「あなたを（だれを）」は？", back: "you", hint: "目的格" },
                    { id: 20, front: "「彼を（だれを）」は？", back: "him", hint: "目的格" },
                    { id: 21, front: "「彼女を（だれを）」は？", back: "her", hint: "目的格" },
                    { id: 22, front: "「それを（なにを）」は？", back: "it", hint: "目的格" },
                    { id: 23, front: "「私たちを（だれを）」は？", back: "us", hint: "目的格" },
                    { id: 24, front: "「彼らを（だれを）」は？", back: "them", hint: "目的格" },
                    { id: 25, front: "「私の（だれの＋名詞）」は？", back: "my", hint: "所有格" },
                    { id: 26, front: "「あなたの（だれの＋名詞）」は？", back: "your", hint: "所有格" },
                    { id: 27, front: "「彼の（だれの＋名詞）」は？", back: "his", hint: "所有格" },
                    { id: 28, front: "「彼女の（だれの＋名詞）」は？", back: "her", hint: "所有格" },
                    { id: 29, front: "「それの（だれの＋名詞）」は？", back: "its", hint: "所有格" },
                    { id: 30, front: "「私たちの（だれの＋名詞）」は？", back: "our", hint: "所有格" },
                    { id: 31, front: "「彼らの（だれの＋名詞）」は？", back: "their", hint: "所有格" },
                    { id: 32, front: "「私のもの（名詞なし）」は？", back: "mine", hint: "所有代名詞" },
                    { id: 33, front: "「あなたのもの（名詞なし）」は？", back: "yours", hint: "所有代名詞" },
                    { id: 34, front: "「彼のもの（名詞なし）」は？", back: "his", hint: "所有代名詞" },
                    { id: 35, front: "「彼女のもの（名詞なし）」は？", back: "hers", hint: "所有代名詞" },
                    { id: 36, front: "「私たちのもの（名詞なし）」は？", back: "ours", hint: "所有代名詞" },
                    { id: 37, front: "「彼らのもの（名詞なし）」は？", back: "theirs", hint: "所有代名詞" },
                    { id: 38, front: "主格を使う場所は？", back: "「だれが」の場所（主語）", hint: "主語の位置" },
                    { id: 39, front: "目的格を使う場所は？", back: "「だれを／なにを」の場所（目的語）", hint: "目的語の位置" },
                    { id: 40, front: "前置詞のあとにおける代名詞は？", back: "目的格", hint: "with him など" },
                    { id: 41, front: "所有格を使う形は？", back: "「だれの＋名詞」", hint: "my book など" },
                    { id: 42, front: "「my book」は日本語で？", back: "私の本", hint: "所有格 + 名詞" },
                    { id: 43, front: "「mine」は日本語で？", back: "私のもの", hint: "所有代名詞" },
                    { id: 44, front: "「her bag」は日本語で？", back: "彼女のかばん", hint: "所有格 + 名詞" },
                    { id: 45, front: "「hers」は日本語で？", back: "彼女のもの", hint: "所有代名詞" },
                    { id: 46, front: "「their house」は日本語で？", back: "彼らの家", hint: "所有格 + 名詞" },
                    { id: 47, front: "「theirs」は日本語で？", back: "彼らのもの", hint: "所有代名詞" }
                ],
                errorQuestions: [
                    { id: 1, original: "I know he.", error: { part: 'what', wrong: "he", correct: "him", sentenceParts: { who: "I", does: "know", what: "he" } } },
                    { id: 2, original: "Please help my.", error: { part: 'what', wrong: "my", correct: "me", sentenceParts: { does: "Please help", what: "my" } } },
                    { id: 3, original: "Look at they.", error: { part: 'what', wrong: "they", correct: "them", sentenceParts: { does: "Look at", what: "they" } } },
                    { id: 4, original: "I love she.", error: { part: 'what', wrong: "she", correct: "her", sentenceParts: { who: "I", does: "love", what: "she" } } },
                    { id: 5, original: "This bag is my.", error: { part: 'what', wrong: "my", correct: "mine", sentenceParts: { who: "This bag", does: "is", what: "my" } } },
                    { id: 6, original: "That house is him.", error: { part: 'what', wrong: "him", correct: "his", sentenceParts: { who: "That house", does: "is", what: "him" } } },
                    { id: 7, original: "That desk is them.", error: { part: 'what', wrong: "them", correct: "theirs", sentenceParts: { who: "That desk", does: "is", what: "them" } } },
                    { id: 8, original: "This book is us.", error: { part: 'what', wrong: "us", correct: "ours", sentenceParts: { who: "This book", does: "is", what: "us" } } },
                    { id: 9, original: "I have a brother. him name is Ken.", error: { part: 'who', wrong: "him name", correct: "His name", sentenceParts: { who: "him name", does: "is", what: "Ken" } } },
                    { id: 10, original: "Mr. White is us teacher.", error: { part: 'what', wrong: "us teacher", correct: "our teacher", sentenceParts: { who: "Mr. White", does: "is", what: "us teacher" } } },
                    { id: 11, original: "This is Ken book.", error: { part: 'what', wrong: "Ken book", correct: "Ken's book", sentenceParts: { who: "This", does: "is", what: "Ken book" } } },
                    { id: 12, original: "I know she.", error: { part: 'what', wrong: "she", correct: "her", sentenceParts: { who: "I", does: "know", what: "she" } } },
                    { id: 13, original: "I go to school with he.", error: { part: 'what', wrong: "he", correct: "him", sentenceParts: { who: "I", does: "go to school with", what: "he" } } },
                    { id: 14, original: "That book is her.", error: { part: 'what', wrong: "her", correct: "hers", sentenceParts: { who: "That book", does: "is", what: "her" } } },
                    { id: 15, original: "That computer is me father's.", error: { part: 'what', wrong: "me father's", correct: "my father's", sentenceParts: { who: "That computer", does: "is", what: "me father's" } } }
                ],
                questions: [
                    {
                        id: 1, original: "私は彼を知っている。", translation: "I know him.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "知っている", en: "know" }, what: { jp: "彼を", en: "him" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "知っている", category: 'does' }, { id: 'j3', text: "彼を", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "know", category: 'does' }, { id: 'e3', text: "him", category: 'what' }]
                    },
                    {
                        id: 2, original: "私は彼女を愛している。", translation: "I love her.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "愛している", en: "love" }, what: { jp: "彼女を", en: "her" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "愛している", category: 'does' }, { id: 'j3', text: "彼女を", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "love", category: 'does' }, { id: 'e3', text: "her", category: 'what' }]
                    },
                    {
                        id: 3, original: "このカバンは私のものです。", translation: "This bag is mine.",
                        rows: [{ id: 'm1', structure: { who: { jp: "このカバンは", en: "This bag" }, does: { jp: "です", en: "is" }, what: { jp: "私のもの", en: "mine" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "このカバンは", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "私のもの", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "This bag", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "mine", category: 'what' }]
                    },
                    {
                        id: 4, original: "あの家は彼のものです。", translation: "That house is his.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あの家は", en: "That house" }, does: { jp: "です", en: "is" }, what: { jp: "彼のもの", en: "his" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あの家は", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "彼のもの", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "That house", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "his", category: 'what' }]
                    },
                    {
                        id: 5, original: "あの机は彼らのものです。", translation: "That desk is theirs.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あの机は", en: "That desk" }, does: { jp: "です", en: "is" }, what: { jp: "彼らのもの", en: "theirs" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あの机は", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "彼らのもの", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "That desk", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "theirs", category: 'what' }]
                    },
                    {
                        id: 6, original: "この本は私たちのものです。", translation: "This book is ours.",
                        rows: [{ id: 'm1', structure: { who: { jp: "この本は", en: "This book" }, does: { jp: "です", en: "is" }, what: { jp: "私たちのもの", en: "ours" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "この本は", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "私たちのもの", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "This book", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "ours", category: 'what' }]
                    },
                    {
                        id: 7, original: "私には兄が一人いる。彼の名前はケンです。", translation: "I have a brother. His name is Ken.",
                        rows: [
                            { id: 'm1', structure: { who: { jp: "私には", en: "I" }, does: { jp: "いる", en: "have" }, what: { jp: "兄が一人", en: "a brother" }, where: null, how: null, when: null } },
                            { id: 'm2', structure: { who: { jp: "彼の名前は", en: "His name" }, does: { jp: "です", en: "is" }, what: { jp: "ケン", en: "Ken" }, where: null, how: null, when: null } }
                        ],
                        jpOptions: [
                            { id: 'j1', text: "私には", category: 'who' }, { id: 'j2', text: "いる", category: 'does' }, { id: 'j3', text: "兄が一人", category: 'what' },
                            { id: 'j4', text: "彼の名前は", category: 'who' }, { id: 'j5', text: "です", category: 'does' }, { id: 'j6', text: "ケン", category: 'what' }
                        ],
                        enOptions: [
                            { id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "have", category: 'does' }, { id: 'e3', text: "a brother", category: 'what' },
                            { id: 'e4', text: "His name", category: 'who' }, { id: 'e5', text: "is", category: 'does' }, { id: 'e6', text: "Ken", category: 'what' }
                        ]
                    },
                    {
                        id: 8, original: "ホワイトさんは私たちの先生だ。", translation: "Mr. White is our teacher.",
                        rows: [{ id: 'm1', structure: { who: { jp: "ホワイトさんは", en: "Mr. White" }, does: { jp: "だ", en: "is" }, what: { jp: "私たちの先生", en: "our teacher" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "ホワイトさんは", category: 'who' }, { id: 'j2', text: "だ", category: 'does' }, { id: 'j3', text: "私たちの先生", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "Mr. White", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "our teacher", category: 'what' }]
                    },
                    {
                        id: 9, original: "これはケンの本だ。", translation: "This is Ken's book.",
                        rows: [{ id: 'm1', structure: { who: { jp: "これは", en: "This" }, does: { jp: "だ", en: "is" }, what: { jp: "ケンの本", en: "Ken's book" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "これは", category: 'who' }, { id: 'j2', text: "だ", category: 'does' }, { id: 'j3', text: "ケンの本", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "This", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "Ken's book", category: 'what' }]
                    },
                    {
                        id: 10, original: "私は彼女のことを知っている。", translation: "I know her.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "知っている", en: "know" }, what: { jp: "彼女のことを", en: "her" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "知っている", category: 'does' }, { id: 'j3', text: "彼女のことを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "know", category: 'does' }, { id: 'e3', text: "her", category: 'what' }]
                    },
                    {
                        id: 11, original: "私は彼と一緒に学校へ行く。", translation: "I go to school with him.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "行く", en: "go" }, what: { jp: "彼と一緒に学校へ", en: "to school with him" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "行く", category: 'does' }, { id: 'j3', text: "彼と一緒に学校へ", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "go", category: 'does' }, { id: 'e3', text: "to school with him", category: 'what' }]
                    },
                    {
                        id: 12, original: "あの本は彼女のものです。", translation: "That book is hers.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あの本は", en: "That book" }, does: { jp: "です", en: "is" }, what: { jp: "彼女のもの", en: "hers" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あの本は", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "彼女のもの", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "That book", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "hers", category: 'what' }]
                    },
                    {
                        id: 13, original: "あのコンピュータは私の父のものです。", translation: "That computer is my father's.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あのコンピュータは", en: "That computer" }, does: { jp: "です", en: "is" }, what: { jp: "私の父のもの", en: "my father's" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あのコンピュータは", category: 'who' }, { id: 'j2', text: "です", category: 'does' }, { id: 'j3', text: "私の父のもの", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "That computer", category: 'who' }, { id: 'e2', text: "is", category: 'does' }, { id: 'e3', text: "my father's", category: 'what' }]
                    }
                ],
                instantQuestions: [
                    { id: 1, jp: "私は彼を知っている。", answer: "I know him." },
                    { id: 2, jp: "私は彼女を愛している。", answer: "I love her." },
                    { id: 3, jp: "このカバンは私のものです。", answer: "This bag is mine." },
                    { id: 4, jp: "あの家は彼のものです。", answer: "That house is his." },
                    { id: 5, jp: "あの机は彼らのものです。", answer: "That desk is theirs." },
                    { id: 6, jp: "この本は私たちのものです。", answer: "This book is ours." },
                    { id: 7, jp: "私には兄が一人いる。彼の名前はケンです。", answer: "I have a brother. His name is Ken." },
                    { id: 8, jp: "ホワイトさんは私たちの先生だ。", answer: "Mr. White is our teacher." },
                    { id: 9, jp: "これはケンの本だ。", answer: "This is Ken's book." },
                    { id: 10, jp: "私は彼女のことを知っている。", answer: "I know her." },
                    { id: 11, jp: "私は彼と一緒に学校へ行く。", answer: "I go to school with him." },
                    { id: 12, jp: "あの本は彼女のものです。", answer: "That book is hers." },
                    { id: 13, jp: "あのコンピュータは私の父のものです。", answer: "That computer is my father's." }
                ],
                writingQuestions: [
                    { id: 1, jp: "「私（だれが）」は？", answer: "I" },
                    { id: 2, jp: "「あなた（だれが）」は？", answer: "you" },
                    { id: 3, jp: "「彼（だれが）」は？", answer: "he" },
                    { id: 4, jp: "「彼女（だれが）」は？", answer: "she" },
                    { id: 5, jp: "「それ（だれが）」は？", answer: "it" },
                    { id: 6, jp: "「私たち（だれが）」は？", answer: "we" },
                    { id: 7, jp: "「彼ら（だれが）」は？", answer: "they" },
                    { id: 8, jp: "「私を（だれを）」は？", answer: "me" },
                    { id: 9, jp: "「あなたを（だれを）」は？", answer: "you" },
                    { id: 10, jp: "「彼を（だれを）」は？", answer: "him" },
                    { id: 11, jp: "「彼女を（だれを）」は？", answer: "her" },
                    { id: 12, jp: "「それを（なにを）」は？", answer: "it" },
                    { id: 13, jp: "「私たちを（だれを）」は？", answer: "us" },
                    { id: 14, jp: "「彼らを（だれを）」は？", answer: "them" },
                    { id: 15, jp: "「私の（だれの＋名詞）」は？", answer: "my" },
                    { id: 16, jp: "「あなたの（だれの＋名詞）」は？", answer: "your" },
                    { id: 17, jp: "「彼の（だれの＋名詞）」は？", answer: "his" },
                    { id: 18, jp: "「彼女の（だれの＋名詞）」は？", answer: "her" },
                    { id: 19, jp: "「それの（だれの＋名詞）」は？", answer: "its" },
                    { id: 20, jp: "「私たちの（だれの＋名詞）」は？", answer: "our" },
                    { id: 21, jp: "「彼らの（だれの＋名詞）」は？", answer: "their" },
                    { id: 22, jp: "「私のもの（名詞なし）」は？", answer: "mine" },
                    { id: 23, jp: "「あなたのもの（名詞なし）」は？", answer: "yours" },
                    { id: 24, jp: "「彼のもの（名詞なし）」は？", answer: "his" },
                    { id: 25, jp: "「彼女のもの（名詞なし）」は？", answer: "hers" },
                    { id: 26, jp: "「私たちのもの（名詞なし）」は？", answer: "ours" },
                    { id: 27, jp: "「彼らのもの（名詞なし）」は？", answer: "theirs" },
                    { id: 28, jp: "私は彼を知っている。", answer: "I know him." },
                    { id: 29, jp: "私は彼女を愛している。", answer: "I love her." },
                    { id: 30, jp: "このカバンは私のものです。", answer: "This bag is mine." },
                    { id: 31, jp: "あの家は彼のものです。", answer: "That house is his." },
                    { id: 32, jp: "あの机は彼らのものです。", answer: "That desk is theirs." },
                    { id: 33, jp: "この本は私たちのものです。", answer: "This book is ours." },
                    { id: 34, jp: "私には兄が一人いる。彼の名前はケンです。", answer: "I have a brother. His name is Ken." },
                    { id: 35, jp: "ホワイトさんは私たちの先生だ。", answer: "Mr. White is our teacher." },
                    { id: 36, jp: "これはケンの本だ。", answer: "This is Ken's book." },
                    { id: 37, jp: "私は彼女のことを知っている。", answer: "I know her." },
                    { id: 38, jp: "私は彼と一緒に学校へ行く。", answer: "I go to school with him." },
                    { id: 39, jp: "あの本は彼女のものです。", answer: "That book is hers." },
                    { id: 40, jp: "あのコンピュータは私の父のものです。", answer: "That computer is my father's." }
                ]
            },
            {
                id: 2026022607,
                title: "否定文",
                stepOrder: ['flashcard', 'error', 'sort', 'instant', 'writing', 'complete'],
                flashcards: [
                    { id: 1, front: "否定文を作る時に、まず明確に分けなければならない2つの文章の種類は何？", back: "be動詞の文章と、一般動詞の文章", hint: "まず文の種類を判定" },
                    { id: 2, front: "be動詞の文章で否定文を作る際、「not」はどこに入れる？", back: "be動詞の後ろ", hint: "be + not" },
                    { id: 3, front: "「I am a student.」の否定文は？", back: "I am not a student.", hint: "am の後ろに not" },
                    { id: 4, front: "「It is a drop.」の否定文は？", back: "It is not a drop.", hint: "is not" },
                    { id: 5, front: "be動詞の否定文を作るルールを短く言うと？", back: "be動詞の後ろにnot（b動詞の後ろにnot）", hint: "b動詞の後ろに not" },
                    { id: 6, front: "一般動詞の文章で否定文を作る際、どこに「not」を入れる？", back: "一般動詞の前", hint: "do/does + not + 動詞" },
                    { id: 7, front: "「do not」を短縮した形は何？", back: "don't", hint: "短縮形" },
                    { id: 8, front: "「You play tennis.」の否定文は？", back: "You don't play tennis.", hint: "don't + 動詞原形" },
                    { id: 9, front: "一般動詞のルールは？", back: "be動詞と同じように、主語によって形が変わる", hint: "主語一致" },
                    { id: 10, front: "主語がIとYou以外の単数の時、一般動詞の形はどう変わる？", back: "一般動詞にsやesをつける", hint: "三単現" },
                    { id: 11, front: "一般動詞にsやesをつける時はどんなとき？", back: "主語がIとYou以外の単数の時", hint: "he/she/it など" },
                    { id: 12, front: "主語がIとYou以外の単数の時に否定文を作る際、「do」はどう変化する？", back: "does（doにesがついてdoesになる）", hint: "does not" },
                    { id: 13, front: "「He plays tennis.」の否定文は？", back: "He doesn't play tennis.", hint: "doesn't + play" },
                    { id: 14, front: "三人称単数の否定文で、「does not」を使った後の動詞の形はどうなる？", back: "原形（sを取った形）になる", hint: "does not play" },
                    { id: 15, front: "頻度を表す副詞（always, sometimes等）を入れる場所のルールは？", back: "否定の「not」と同じ場所", hint: "not と同じ位置" },
                    { id: 16, front: "be動詞の文章に頻度の副詞を入れる場所は？", back: "be動詞の後ろ", hint: "am/is/are の後ろ" },
                    { id: 17, front: "一般動詞の文章に頻度の副詞を入れる場所は？", back: "一般動詞の前", hint: "play の前" },
                    { id: 18, front: "頻度の副詞で、「0%（一度もない）」を表す言葉は何？", back: "never", hint: "0%" },
                    { id: 19, front: "動画内で紹介された「100%」の頻度を表す副詞は？", back: "always", hint: "100%" },
                    { id: 20, front: "動画内で紹介された「ときどき」を表す副詞は？", back: "sometimes", hint: "ときどき" }
                ],
                errorQuestions: [
                    { id: 1, original: "I do not a student.", error: { part: 'does', wrong: "do not", correct: "am not", sentenceParts: { who: "I", does: "do not", what: "a student" } } },
                    { id: 2, original: "It is not a drop.", error: { isCorrectSentence: true, sentenceParts: { who: "It", does: "is not", what: "a drop" } } },
                    { id: 3, original: "You aren't play tennis.", error: { part: 'does', wrong: "aren't play", correct: "don't play", sentenceParts: { who: "You", does: "aren't play", what: "tennis" } } },
                    { id: 4, original: "He isn't play tennis.", error: { part: 'does', wrong: "isn't play", correct: "doesn't play", sentenceParts: { who: "He", does: "isn't play", what: "tennis" } } },
                    { id: 5, original: "I does not a teacher.", error: { part: 'does', wrong: "does not", correct: "am not", sentenceParts: { who: "I", does: "does not", what: "a teacher" } } },
                    { id: 6, original: "You are not a student.", error: { isCorrectSentence: true, sentenceParts: { who: "You", does: "are not", what: "a student" } } },
                    { id: 7, original: "This not is a book.", error: { part: 'does', wrong: "not is", correct: "is not", sentenceParts: { who: "This", does: "not is", what: "a book" } } },
                    { id: 8, original: "He does not an English teacher.", error: { part: 'does', wrong: "does not", correct: "is not", sentenceParts: { who: "He", does: "does not", what: "an English teacher" } } },
                    { id: 9, original: "I do not play the guitar.", error: { isCorrectSentence: true, sentenceParts: { who: "I", does: "do not play", what: "the guitar" } } },
                    { id: 10, original: "We don't teachers.", error: { part: 'does', wrong: "don't", correct: "aren't", sentenceParts: { who: "We", does: "don't", what: "teachers" } } },
                    { id: 11, original: "Ken don't play baseball.", error: { part: 'does', wrong: "don't play", correct: "doesn't play", sentenceParts: { who: "Ken", does: "don't play", what: "baseball" } } },
                    { id: 12, original: "This isn't my bag.", error: { isCorrectSentence: true, sentenceParts: { who: "This", does: "isn't", what: "my bag" } } },
                    { id: 13, original: "They doesn't go to school on Sunday.", error: { part: 'does', wrong: "doesn't go", correct: "don't go", sentenceParts: { who: "They", does: "doesn't go", where: "to school", when: "on Sunday" } } },
                    { id: 14, original: "Tom not does like cats.", error: { part: 'does', wrong: "not does like", correct: "does not like", sentenceParts: { who: "Tom", does: "not does like", what: "cats" } } },
                    { id: 15, original: "Mary and I aren't play the piano.", error: { part: 'does', wrong: "aren't play", correct: "don't play", sentenceParts: { who: "Mary and I", does: "aren't play", what: "the piano" } } }
                ],
                questions: [
                    {
                        id: 1, original: "私は生徒ではありません。", translation: "I am not a student.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "ではありません", en: "am not" }, what: { jp: "生徒", en: "a student" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "ではありません", category: 'does' }, { id: 'j3', text: "生徒", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "am not", category: 'does' }, { id: 'e3', text: "a student", category: 'what' }]
                    },
                    {
                        id: 2, original: "それはアメではありません。", translation: "It is not a drop.",
                        rows: [{ id: 'm1', structure: { who: { jp: "それは", en: "It" }, does: { jp: "ではありません", en: "is not" }, what: { jp: "アメ", en: "a drop" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "それは", category: 'who' }, { id: 'j2', text: "ではありません", category: 'does' }, { id: 'j3', text: "アメ", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "It", category: 'who' }, { id: 'e2', text: "is not", category: 'does' }, { id: 'e3', text: "a drop", category: 'what' }]
                    },
                    {
                        id: 3, original: "あなたはテニスをしません。", translation: "You don't play tennis.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あなたは", en: "You" }, does: { jp: "しません", en: "don't play" }, what: { jp: "テニスを", en: "tennis" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あなたは", category: 'who' }, { id: 'j2', text: "しません", category: 'does' }, { id: 'j3', text: "テニスを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "You", category: 'who' }, { id: 'e2', text: "don't play", category: 'does' }, { id: 'e3', text: "tennis", category: 'what' }]
                    },
                    {
                        id: 4, original: "彼はテニスをしません。", translation: "He doesn't play tennis.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼は", en: "He" }, does: { jp: "しません", en: "doesn't play" }, what: { jp: "テニスを", en: "tennis" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "しません", category: 'does' }, { id: 'j3', text: "テニスを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "He", category: 'who' }, { id: 'e2', text: "doesn't play", category: 'does' }, { id: 'e3', text: "tennis", category: 'what' }]
                    },
                    {
                        id: 5, original: "私は先生ではありません。", translation: "I am not a teacher.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "ではありません", en: "am not" }, what: { jp: "先生", en: "a teacher" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "ではありません", category: 'does' }, { id: 'j3', text: "先生", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "am not", category: 'does' }, { id: 'e3', text: "a teacher", category: 'what' }]
                    },
                    {
                        id: 6, original: "あなたは生徒ではありません。", translation: "You are not a student.",
                        rows: [{ id: 'm1', structure: { who: { jp: "あなたは", en: "You" }, does: { jp: "ではありません", en: "are not" }, what: { jp: "生徒", en: "a student" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "あなたは", category: 'who' }, { id: 'j2', text: "ではありません", category: 'does' }, { id: 'j3', text: "生徒", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "You", category: 'who' }, { id: 'e2', text: "are not", category: 'does' }, { id: 'e3', text: "a student", category: 'what' }]
                    },
                    {
                        id: 7, original: "これは本ではありません。", translation: "This is not a book.",
                        rows: [{ id: 'm1', structure: { who: { jp: "これは", en: "This" }, does: { jp: "ではありません", en: "is not" }, what: { jp: "本", en: "a book" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "これは", category: 'who' }, { id: 'j2', text: "ではありません", category: 'does' }, { id: 'j3', text: "本", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "This", category: 'who' }, { id: 'e2', text: "is not", category: 'does' }, { id: 'e3', text: "a book", category: 'what' }]
                    },
                    {
                        id: 8, original: "彼は英語の先生ではありません。", translation: "He is not an English teacher.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼は", en: "He" }, does: { jp: "ではありません", en: "is not" }, what: { jp: "英語の先生", en: "an English teacher" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "彼は", category: 'who' }, { id: 'j2', text: "ではありません", category: 'does' }, { id: 'j3', text: "英語の先生", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "He", category: 'who' }, { id: 'e2', text: "is not", category: 'does' }, { id: 'e3', text: "an English teacher", category: 'what' }]
                    },
                    {
                        id: 9, original: "私はギターを弾きません。", translation: "I do not play the guitar.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私は", en: "I" }, does: { jp: "弾きません", en: "do not play" }, what: { jp: "ギターを", en: "the guitar" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私は", category: 'who' }, { id: 'j2', text: "弾きません", category: 'does' }, { id: 'j3', text: "ギターを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "I", category: 'who' }, { id: 'e2', text: "do not play", category: 'does' }, { id: 'e3', text: "the guitar", category: 'what' }]
                    },
                    {
                        id: 10, original: "私たちは先生ではありません。", translation: "We aren't teachers.",
                        rows: [{ id: 'm1', structure: { who: { jp: "私たちは", en: "We" }, does: { jp: "ではありません", en: "aren't" }, what: { jp: "先生", en: "teachers" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "私たちは", category: 'who' }, { id: 'j2', text: "ではありません", category: 'does' }, { id: 'j3', text: "先生", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "We", category: 'who' }, { id: 'e2', text: "aren't", category: 'does' }, { id: 'e3', text: "teachers", category: 'what' }]
                    },
                    {
                        id: 11, original: "ケンは野球をしません。", translation: "Ken doesn't play baseball.",
                        rows: [{ id: 'm1', structure: { who: { jp: "ケンは", en: "Ken" }, does: { jp: "しません", en: "doesn't play" }, what: { jp: "野球を", en: "baseball" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "ケンは", category: 'who' }, { id: 'j2', text: "しません", category: 'does' }, { id: 'j3', text: "野球を", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "Ken", category: 'who' }, { id: 'e2', text: "doesn't play", category: 'does' }, { id: 'e3', text: "baseball", category: 'what' }]
                    },
                    {
                        id: 12, original: "これは私のカバンではありません。", translation: "This isn't my bag.",
                        rows: [{ id: 'm1', structure: { who: { jp: "これは", en: "This" }, does: { jp: "ではありません", en: "isn't" }, what: { jp: "私のカバン", en: "my bag" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "これは", category: 'who' }, { id: 'j2', text: "ではありません", category: 'does' }, { id: 'j3', text: "私のカバン", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "This", category: 'who' }, { id: 'e2', text: "isn't", category: 'does' }, { id: 'e3', text: "my bag", category: 'what' }]
                    },
                    {
                        id: 13, original: "彼らは日曜日に学校に行きません。", translation: "They don't go to school on Sunday.",
                        rows: [{ id: 'm1', structure: { who: { jp: "彼らは", en: "They" }, does: { jp: "行きません", en: "don't go" }, what: null, where: { jp: "学校に", en: "to school" }, how: null, when: { jp: "日曜日に", en: "on Sunday" } } }],
                        jpOptions: [{ id: 'j1', text: "彼らは", category: 'who' }, { id: 'j2', text: "行きません", category: 'does' }, { id: 'j3', text: "学校に", category: 'where' }, { id: 'j4', text: "日曜日に", category: 'when' }],
                        enOptions: [{ id: 'e1', text: "They", category: 'who' }, { id: 'e2', text: "don't go", category: 'does' }, { id: 'e3', text: "to school", category: 'where' }, { id: 'e4', text: "on Sunday", category: 'when' }]
                    },
                    {
                        id: 14, original: "トムは猫が好きではありません。", translation: "Tom doesn't like cats.",
                        rows: [{ id: 'm1', structure: { who: { jp: "トムは", en: "Tom" }, does: { jp: "好きではありません", en: "doesn't like" }, what: { jp: "猫が", en: "cats" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "トムは", category: 'who' }, { id: 'j2', text: "好きではありません", category: 'does' }, { id: 'j3', text: "猫が", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "Tom", category: 'who' }, { id: 'e2', text: "doesn't like", category: 'does' }, { id: 'e3', text: "cats", category: 'what' }]
                    },
                    {
                        id: 15, original: "メアリーと私はピアノを弾きません。", translation: "Mary and I don't play the piano.",
                        rows: [{ id: 'm1', structure: { who: { jp: "メアリーと私は", en: "Mary and I" }, does: { jp: "弾きません", en: "don't play" }, what: { jp: "ピアノを", en: "the piano" }, where: null, how: null, when: null } }],
                        jpOptions: [{ id: 'j1', text: "メアリーと私は", category: 'who' }, { id: 'j2', text: "弾きません", category: 'does' }, { id: 'j3', text: "ピアノを", category: 'what' }],
                        enOptions: [{ id: 'e1', text: "Mary and I", category: 'who' }, { id: 'e2', text: "don't play", category: 'does' }, { id: 'e3', text: "the piano", category: 'what' }]
                    }
                ],
                instantQuestions: [
                    { id: 1, jp: "私は生徒ではありません。", answer: "I am not a student." },
                    { id: 2, jp: "それはアメではありません。", answer: "It is not a drop." },
                    { id: 3, jp: "あなたはテニスをしません。", answer: "You don't play tennis." },
                    { id: 4, jp: "彼はテニスをしません。", answer: "He doesn't play tennis." },
                    { id: 5, jp: "私は先生ではありません。", answer: "I am not a teacher." },
                    { id: 6, jp: "あなたは生徒ではありません。", answer: "You are not a student." },
                    { id: 7, jp: "これは本ではありません。", answer: "This is not a book." },
                    { id: 8, jp: "彼は英語の先生ではありません。", answer: "He is not an English teacher." },
                    { id: 9, jp: "私はギターを弾きません。", answer: "I do not play the guitar." },
                    { id: 10, jp: "私たちは先生ではありません。", answer: "We aren't teachers." },
                    { id: 11, jp: "ケンは野球をしません。", answer: "Ken doesn't play baseball." },
                    { id: 12, jp: "これは私のカバンではありません。", answer: "This isn't my bag." },
                    { id: 13, jp: "彼らは日曜日に学校に行きません。", answer: "They don't go to school on Sunday." },
                    { id: 14, jp: "トムは猫が好きではありません。", answer: "Tom doesn't like cats." },
                    { id: 15, jp: "メアリーと私はピアノを弾きません。", answer: "Mary and I don't play the piano." }
                ],
                writingQuestions: [
                    { id: 1, jp: "私は生徒ではありません。", answer: "I am not a student." },
                    { id: 2, jp: "それはアメではありません。", answer: "It is not a drop." },
                    { id: 3, jp: "あなたはテニスをしません。", answer: "You don't play tennis." },
                    { id: 4, jp: "彼はテニスをしません。", answer: "He doesn't play tennis." },
                    { id: 5, jp: "私は先生ではありません。", answer: "I am not a teacher." },
                    { id: 6, jp: "あなたは生徒ではありません。", answer: "You are not a student." },
                    { id: 7, jp: "これは本ではありません。", answer: "This is not a book." },
                    { id: 8, jp: "彼は英語の先生ではありません。", answer: "He is not an English teacher." },
                    { id: 9, jp: "私はギターを弾きません。", answer: "I do not play the guitar." },
                    { id: 10, jp: "私たちは先生ではありません。", answer: "We aren't teachers." },
                    { id: 11, jp: "ケンは野球をしません。", answer: "Ken doesn't play baseball." },
                    { id: 12, jp: "これは私のカバンではありません。", answer: "This isn't my bag." },
                    { id: 13, jp: "彼らは日曜日に学校に行きません。", answer: "They don't go to school on Sunday." },
                    { id: 14, jp: "トムは猫が好きではありません。", answer: "Tom doesn't like cats." },
                    { id: 15, jp: "メアリーと私はピアノを弾きません。", answer: "Mary and I don't play the piano." }
                ]
            },
            {
                id: 2026022608,
                title: "疑問文",
                stepOrder: ['flashcard', 'error', 'sort', 'instant', 'writing', 'complete'],
                showInactiveSortBoxes: true,
                sortFolders: [
                    { key: 'lead', label: 'しますか？/ですか？', color: 'bg-pink-100 border-pink-300 text-pink-900' },
                    { key: 'who', label: 'だれが', color: 'bg-green-100 border-green-300 text-green-900' },
                    { key: 'does', label: 'する・です', color: 'bg-blue-100 border-blue-300 text-blue-900' },
                    { key: 'what', label: 'だれ・なに', color: 'bg-yellow-100 border-yellow-300 text-yellow-900' },
                    { key: 'where', label: 'どこ', color: 'bg-orange-100 border-orange-300 text-orange-900' },
                    { key: 'how', label: '状態(状)', color: 'bg-purple-100 border-purple-300 text-purple-900' },
                    { key: 'when', label: 'いつ', color: 'bg-teal-100 border-teal-300 text-teal-900' }
                ],
                flashcards: [
                    { id: 1, front: "be動詞の文章を疑問文にする時の基本ルールは？", back: "主語とbe動詞を逆にする", hint: "Are you ...? の形" },
                    { id: 2, front: "一般動詞の文章を疑問文にする際、文頭に置く言葉は何？", back: "Do または Does", hint: "Do/Does + 主語 + 動詞原形" },
                    { id: 3, front: "「He studies...」を疑問文（Does...）にする時、動詞の形はどうなる？", back: "原形に戻る（studiesがstudyになる）", hint: "does の後ろは原形" },
                    { id: 4, front: "疑問文の答え方で、一番の「落とし穴（ターニングポイント）」は何？", back: "答えの文の主語を「代名詞」に変えること", hint: "this/that は it に" },
                    { id: 5, front: "答えの文の主語（代名詞）を決めるためのルールは？", back: "元の文の「主語」を代名詞に置き換える", hint: "主語を見て置き換える" },
                    { id: 6, front: "答えの文の主語として使える代名詞は全部で何種類？", back: "8種類（I, you, he, she, it, we, you, they）", hint: "主格8つ" },
                    { id: 7, front: "答えの文の主語に「this」や「that」を使うことはできる？", back: "できない（必ずitなどに置き換える）", hint: "this/that は it" },
                    { id: 8, front: "「My car」を代名詞に置き換えると？", back: "it", hint: "単数モノ" },
                    { id: 9, front: "「My cars（複数形）」を代名詞に置き換えると？", back: "they", hint: "複数モノ" },
                    { id: 10, front: "「His sisters（複数形）」を代名詞に置き換えると？", back: "they", hint: "複数人" },
                    { id: 11, front: "「Is this book yours?」に対する「Yes」の答え方は？", back: "Yes, it is.", hint: "this -> it" },
                    { id: 12, front: "「Are my cars new?」に対する「No」の答え方は？", back: "No, they are not. (No, they aren't.)", hint: "cars -> they" },
                    { id: 13, front: "一般動詞の疑問文（Do/Doesで始まる文）で答える際、文末には何を使う？", back: "do, does, don't, doesn't のいずれか", hint: "助動詞で答える" },
                    { id: 14, front: "「Do they play tennis?」に対する「Yes」の答え方は？", back: "Yes, they do.", hint: "they + do" },
                    { id: 15, front: "「Does he study English?」に対する「No」の答え方は？", back: "No, he does not. (No, he doesn't.)", hint: "he + doesn't" },
                    { id: 16, front: "「No」で答える時に、最後に必ず入れなければならない言葉は？", back: "not", hint: "否定は not 必須" },
                    { id: 17, front: "代名詞の置き換えに自信がない場合、先生が推奨している復習回は何？", back: "第13講", hint: "代名詞の復習回" }
                ],
                errorQuestions: [
                    {
                        id: 1,
                        original: "You are a student? -Yes, I am.",
                        error: {
                            part: 'does_pre',
                            wrong: "You are",
                            correct: "Are you",
                            sentenceParts: { does_pre: "You are", who: "a student?", does: "-Yes,", what: "I am." }
                        }
                    },
                    {
                        id: 2,
                        original: "Is this book yours? No, this isn't.",
                        error: {
                            part: 'what',
                            wrong: "No, this isn't.",
                            correct: "No, it isn't.",
                            sentenceParts: { does_pre: "Is", who: "this book", does: "yours?", what: "No, this isn't." }
                        }
                    },
                    {
                        id: 3,
                        original: "Is my cars new? No, they aren't.",
                        error: {
                            part: 'does_pre',
                            wrong: "Is",
                            correct: "Are",
                            sentenceParts: { does_pre: "Is", who: "my cars", does: "new?", what: "No, they aren't." }
                        }
                    },
                    {
                        id: 4,
                        original: "Does his sisters play the guitar? Yes, they do.",
                        error: {
                            part: 'does_pre',
                            wrong: "Does",
                            correct: "Do",
                            sentenceParts: { does_pre: "Does", who: "his sisters", does: "play", what: "the guitar?", where: "Yes, they do." }
                        }
                    },
                    {
                        id: 5,
                        original: "Is he study English? Yes, he does.",
                        error: {
                            part: 'does_pre',
                            wrong: "Is",
                            correct: "Does",
                            sentenceParts: { does_pre: "Is", who: "he", does: "study", what: "English?", where: "Yes, he does." }
                        }
                    },
                    {
                        id: 6,
                        original: "This is your book? Yes, it is.",
                        error: {
                            part: 'does_pre',
                            wrong: "This is",
                            correct: "Is this",
                            sentenceParts: { does_pre: "This is", who: "your book?", does: "Yes, it is." }
                        }
                    },
                    {
                        id: 7,
                        original: "Does she your sister? No, she isn't.",
                        error: {
                            part: 'does_pre',
                            wrong: "Does",
                            correct: "Is",
                            sentenceParts: { does_pre: "Does", who: "she", does: "your sister?", what: "No, she isn't." }
                        }
                    },
                    {
                        id: 8,
                        original: "Do you like soccer? -Yes, I am.",
                        error: {
                            part: 'where',
                            wrong: "-Yes, I am.",
                            correct: "-Yes, I do.",
                            sentenceParts: { does_pre: "Do", who: "you", does: "like", what: "soccer?", where: "-Yes, I am." }
                        }
                    },
                    {
                        id: 9,
                        original: "Are they play tennis? Yes, they do.",
                        error: {
                            part: 'does_pre',
                            wrong: "Are",
                            correct: "Do",
                            sentenceParts: { does_pre: "Are", who: "they", does: "play", what: "tennis?", where: "Yes, they do." }
                        }
                    },
                    {
                        id: 10,
                        original: "Do she play the piano? No, she does.",
                        error: {
                            part: 'does_pre',
                            wrong: "Do",
                            correct: "Does",
                            sentenceParts: { does_pre: "Do", who: "she", does: "play", what: "the piano?", where: "No, she does." }
                        }
                    },
                    {
                        id: 11,
                        original: "You go to the park every Sunday? Yes, I do.",
                        error: {
                            part: 'does_pre',
                            wrong: "You go",
                            correct: "Do you go",
                            sentenceParts: { does_pre: "You go", who: "to the park", does: "every Sunday?", what: "Yes, I do." }
                        }
                    },
                    {
                        id: 12,
                        original: "Does Tom plays the piano well? Yes, he does.",
                        error: {
                            part: 'does',
                            wrong: "plays",
                            correct: "play",
                            sentenceParts: { does_pre: "Does", who: "Tom", does: "plays", what: "the piano well?", where: "Yes, he does." }
                        }
                    },
                    {
                        id: 13,
                        original: "Does Tom and Ken good friends? Yes, they are.",
                        error: {
                            part: 'does_pre',
                            wrong: "Does",
                            correct: "Are",
                            sentenceParts: { does_pre: "Does", who: "Tom and Ken", does: "good friends?", what: "Yes, they are." }
                        }
                    },
                    {
                        id: 14,
                        original: "Does she usually gets up at six in the morning? Yes, she does.",
                        error: {
                            part: 'does',
                            wrong: "usually gets up",
                            correct: "usually get up",
                            sentenceParts: { does_pre: "Does", who: "she", does: "usually gets up", what: "at six in the morning?", where: "Yes, she does." }
                        }
                    },
                    {
                        id: 15,
                        original: "My pen is under the table? Yes, it is.",
                        error: {
                            part: 'does_pre',
                            wrong: "My pen is",
                            correct: "Is my pen",
                            sentenceParts: { does_pre: "My pen is", who: "under the table?", does: "Yes, it is." }
                        }
                    }
                ],
                questions: [
                    createQuestionSortQuestion({
                        id: 1, original: "あなたは生徒ですか。- はい、そうです。", translation: "Are you a student? -Yes, I am.",
                        qLeadJp: "ですか？", qWhoJp: "あなたは", qDoesJp: "（空欄）", qWhatJp: "生徒", qLeadEn: "Are", qWhoEn: "you", qDoesEn: "(blank)", qWhatEn: "a student",
                        aWhoJp: "私は", aDoesJp: "です", aWhoEn: "I", aDoesEn: "am"
                    }),
                    createQuestionSortQuestion({
                        id: 2, original: "この本はあなたのものですか。- いいえ、違います。", translation: "Is this book yours? -No, it isn't.",
                        qLeadJp: "ですか？", qWhoJp: "この本は", qDoesJp: "（空欄）", qWhatJp: "あなたのもの", qLeadEn: "Is", qWhoEn: "this book", qDoesEn: "(blank)", qWhatEn: "yours",
                        aWhoJp: "それは", aDoesJp: "ではありません", aWhoEn: "it", aDoesEn: "isn't"
                    }),
                    createQuestionSortQuestion({
                        id: 3, original: "私の車は新しいですか。- いいえ、違います。", translation: "Are my cars new? -No, they aren't.",
                        qLeadJp: "ですか？", qWhoJp: "私の車は", qDoesJp: "（空欄）", qWhatJp: "新しい", qLeadEn: "Are", qWhoEn: "my cars", qDoesEn: "(blank)", qWhatEn: "new",
                        aWhoJp: "それらは", aDoesJp: "ではありません", aWhoEn: "they", aDoesEn: "aren't"
                    }),
                    createQuestionSortQuestion({
                        id: 4, original: "彼の姉たちはギターを弾きますか。- はい、弾きます。", translation: "Do his sisters play the guitar? -Yes, they do.",
                        qLeadJp: "しますか？", qWhoJp: "彼の姉たちは", qDoesJp: "弾く", qWhatJp: "ギターを", qLeadEn: "Do", qWhoEn: "his sisters", qDoesEn: "play", qWhatEn: "the guitar",
                        aWhoJp: "彼女らは", aDoesJp: "します", aWhoEn: "they", aDoesEn: "do"
                    }),
                    createQuestionSortQuestion({
                        id: 5, original: "彼は英語を勉強しますか。- はい、勉強します。", translation: "Does he study English? -Yes, he does.",
                        qLeadJp: "しますか？", qWhoJp: "彼は", qDoesJp: "勉強する", qWhatJp: "英語を", qLeadEn: "Does", qWhoEn: "he", qDoesEn: "study", qWhatEn: "English",
                        aWhoJp: "彼は", aDoesJp: "します", aWhoEn: "he", aDoesEn: "does"
                    }),
                    createQuestionSortQuestion({
                        id: 6, original: "これはあなたの本ですか。- はい、そうです。", translation: "Is this your book? -Yes, it is.",
                        qLeadJp: "ですか？", qWhoJp: "これは", qDoesJp: "（空欄）", qWhatJp: "あなたの本", qLeadEn: "Is", qWhoEn: "this", qDoesEn: "(blank)", qWhatEn: "your book",
                        aWhoJp: "それは", aDoesJp: "です", aWhoEn: "it", aDoesEn: "is"
                    }),
                    createQuestionSortQuestion({
                        id: 7, original: "彼女はあなたの姉ですか。- いいえ、違います。", translation: "Is she your sister? -No, she isn't.",
                        qLeadJp: "ですか？", qWhoJp: "彼女は", qDoesJp: "（空欄）", qWhatJp: "あなたの姉", qLeadEn: "Is", qWhoEn: "she", qDoesEn: "(blank)", qWhatEn: "your sister",
                        aWhoJp: "彼女は", aDoesJp: "ではありません", aWhoEn: "she", aDoesEn: "isn't"
                    }),
                    createQuestionSortQuestion({
                        id: 8, original: "あなたはサッカーが好きですか。- はい、好きです。", translation: "Do you like soccer? -Yes, I do.",
                        qLeadJp: "しますか？", qWhoJp: "あなたは", qDoesJp: "好き", qWhatJp: "サッカーが", qLeadEn: "Do", qWhoEn: "you", qDoesEn: "like", qWhatEn: "soccer",
                        aWhoJp: "私は", aDoesJp: "します", aWhoEn: "I", aDoesEn: "do"
                    }),
                    createQuestionSortQuestion({
                        id: 9, original: "彼らはテニスをしますか。- はい、します。", translation: "Do they play tennis? -Yes, they do.",
                        qLeadJp: "しますか？", qWhoJp: "彼らは", qDoesJp: "する", qWhatJp: "テニスを", qLeadEn: "Do", qWhoEn: "they", qDoesEn: "play", qWhatEn: "tennis",
                        aWhoJp: "彼らは", aDoesJp: "します", aWhoEn: "they", aDoesEn: "do"
                    }),
                    createQuestionSortQuestion({
                        id: 10, original: "彼女はピアノを弾きますか。- いいえ、弾きません。", translation: "Does she play the piano? -No, she doesn't.",
                        qLeadJp: "しますか？", qWhoJp: "彼女は", qDoesJp: "弾く", qWhatJp: "ピアノを", qLeadEn: "Does", qWhoEn: "she", qDoesEn: "play", qWhatEn: "the piano",
                        aWhoJp: "彼女は", aDoesJp: "しません", aWhoEn: "she", aDoesEn: "doesn't"
                    }),
                    createQuestionSortQuestion({
                        id: 11, original: "あなたは毎週日曜日に公園へ行きますか。- はい、行きます。", translation: "Do you go to the park every Sunday? -Yes, I do.",
                        qLeadJp: "しますか？", qWhoJp: "あなたは", qDoesJp: "行く", qWhereJp: "公園へ", qWhenJp: "毎週日曜日に",
                        qLeadEn: "Do", qWhoEn: "you", qDoesEn: "go", qWhereEn: "to the park", qWhenEn: "every Sunday",
                        aWhoJp: "私は", aDoesJp: "します", aWhoEn: "I", aDoesEn: "do"
                    }),
                    createQuestionSortQuestion({
                        id: 12, original: "トムはピアノを上手に弾きますか。- はい、弾きます。", translation: "Does Tom play the piano well? -Yes, he does.",
                        qLeadJp: "しますか？", qWhoJp: "トムは", qDoesJp: "弾く", qWhatJp: "ピアノを", qHowJp: "上手に",
                        qLeadEn: "Does", qWhoEn: "Tom", qDoesEn: "play", qWhatEn: "the piano", qHowEn: "well",
                        aWhoJp: "彼は", aDoesJp: "します", aWhoEn: "he", aDoesEn: "does"
                    }),
                    createQuestionSortQuestion({
                        id: 13, original: "トムとケンは仲の良い友達ですか。- はい、そうです。", translation: "Are Tom and Ken good friends? -Yes, they are.",
                        qLeadJp: "ですか？", qWhoJp: "トムとケンは", qDoesJp: "（空欄）", qWhatJp: "仲の良い友達", qLeadEn: "Are", qWhoEn: "Tom and Ken", qDoesEn: "(blank)", qWhatEn: "good friends",
                        aWhoJp: "彼らは", aDoesJp: "です", aWhoEn: "they", aDoesEn: "are"
                    }),
                    createQuestionSortQuestion({
                        id: 14, original: "彼女は普段、朝の6時に起きますか。- はい、起きます。", translation: "Does she usually get up at six in the morning? -Yes, she does.",
                        qLeadJp: "しますか？", qWhoJp: "彼女は", qDoesJp: "起きる", qHowJp: "普段", qWhenJp: "朝の6時に",
                        qLeadEn: "Does", qWhoEn: "she", qDoesEn: "get up", qHowEn: "usually", qWhenEn: "at six in the morning",
                        aWhoJp: "彼女は", aDoesJp: "します", aWhoEn: "she", aDoesEn: "does"
                    }),
                    createQuestionSortQuestion({
                        id: 15, original: "私のペンはテーブルの下にありますか。- はい、あります。", translation: "Is my pen under the table? -Yes, it is.",
                        qLeadJp: "ですか？", qWhoJp: "私のペンは", qDoesJp: "（空欄）", qWhereJp: "テーブルの下に",
                        qLeadEn: "Is", qWhoEn: "my pen", qDoesEn: "(blank)", qWhereEn: "under the table",
                        aWhoJp: "それは", aDoesJp: "です", aWhoEn: "it", aDoesEn: "is"
                    })
                ],
                instantQuestions: [
                    { id: 1, jp: "あなたは生徒ですか。- はい、そうです。", answer: "Are you a student? -Yes, I am." },
                    { id: 2, jp: "この本はあなたのものですか。- いいえ、違います。", answer: "Is this book yours? -No, it isn't." },
                    { id: 3, jp: "私の車は新しいですか。- いいえ、違います。", answer: "Are my cars new? -No, they aren't." },
                    { id: 4, jp: "彼の姉たちはギターを弾きますか。- はい、弾きます。", answer: "Do his sisters play the guitar? -Yes, they do." },
                    { id: 5, jp: "彼は英語を勉強しますか。- はい、勉強します。", answer: "Does he study English? -Yes, he does." },
                    { id: 6, jp: "これはあなたの本ですか。- はい、そうです。", answer: "Is this your book? -Yes, it is." },
                    { id: 7, jp: "彼女はあなたの姉ですか。- いいえ、違います。", answer: "Is she your sister? -No, she isn't." },
                    { id: 8, jp: "あなたはサッカーが好きですか。- はい、好きです。", answer: "Do you like soccer? -Yes, I do." },
                    { id: 9, jp: "彼らはテニスをしますか。- はい、します。", answer: "Do they play tennis? -Yes, they do." },
                    { id: 10, jp: "彼女はピアノを弾きますか。- いいえ、弾きません。", answer: "Does she play the piano? -No, she doesn't." },
                    { id: 11, jp: "あなたは毎週日曜日に公園へ行きますか。- はい、行きます。", answer: "Do you go to the park every Sunday? -Yes, I do." },
                    { id: 12, jp: "トムはピアノを上手に弾きますか。- はい、弾きます。", answer: "Does Tom play the piano well? -Yes, he does." },
                    { id: 13, jp: "トムとケンは仲の良い友達ですか。- はい、そうです。", answer: "Are Tom and Ken good friends? -Yes, they are." },
                    { id: 14, jp: "彼女は普段、朝の6時に起きますか。- はい、起きます。", answer: "Does she usually get up at six in the morning? -Yes, she does." },
                    { id: 15, jp: "私のペンはテーブルの下にありますか。- はい、あります。", answer: "Is my pen under the table? -Yes, it is." }
                ],
                writingQuestions: [
                    { id: 1, jp: "あなたは生徒ですか。- はい、そうです。", answer: "Are you a student? -Yes, I am." },
                    { id: 2, jp: "この本はあなたのものですか。- いいえ、違います。", answer: "Is this book yours? -No, it isn't." },
                    { id: 3, jp: "私の車は新しいですか。- いいえ、違います。", answer: "Are my cars new? -No, they aren't." },
                    { id: 4, jp: "彼の姉たちはギターを弾きますか。- はい、弾きます。", answer: "Do his sisters play the guitar? -Yes, they do." },
                    { id: 5, jp: "彼は英語を勉強しますか。- はい、勉強します。", answer: "Does he study English? -Yes, he does." },
                    { id: 6, jp: "これはあなたの本ですか。- はい、そうです。", answer: "Is this your book? -Yes, it is." },
                    { id: 7, jp: "彼女はあなたの姉ですか。- いいえ、違います。", answer: "Is she your sister? -No, she isn't." },
                    { id: 8, jp: "あなたはサッカーが好きですか。- はい、好きです。", answer: "Do you like soccer? -Yes, I do." },
                    { id: 9, jp: "彼らはテニスをしますか。- はい、します。", answer: "Do they play tennis? -Yes, they do." },
                    { id: 10, jp: "彼女はピアノを弾きますか。- いいえ、弾きません。", answer: "Does she play the piano? -No, she doesn't." },
                    { id: 11, jp: "あなたは毎週日曜日に公園へ行きますか。- はい、行きます。", answer: "Do you go to the park every Sunday? -Yes, I do." },
                    { id: 12, jp: "トムはピアノを上手に弾きますか。- はい、弾きます。", answer: "Does Tom play the piano well? -Yes, he does." },
                    { id: 13, jp: "トムとケンは仲の良い友達ですか。- はい、そうです。", answer: "Are Tom and Ken good friends? -Yes, they are." },
                    { id: 14, jp: "彼女は普段、朝の6時に起きますか。- はい、起きます。", answer: "Does she usually get up at six in the morning? -Yes, she does." },
                    { id: 15, jp: "私のペンはテーブルの下にありますか。- はい、あります。", answer: "Is my pen under the table? -Yes, it is." }
                ]
            }
        ];



        // ========== ICONS ==========
        const IconBase = ({ children, size = 24, className = "" }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                {children}
            </svg>
        );
        const Brain = (props) => <IconBase {...props}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18" /><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /><path d="M17.599 6.5a3 3 0 0 0 .399-1.375" /><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" /><path d="M3.477 10.896a4 4 0 0 1 .585-.396" /><path d="M19.938 10.5a4 4 0 0 1 .585.396" /><path d="M6 18a4 4 0 0 1-1.967-.516" /><path d="M19.967 17.484A4 4 0 0 1 18 18" /></IconBase>;
        const Layers = (props) => <IconBase {...props}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></IconBase>;
        const ThumbsUp = (props) => <IconBase {...props}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></IconBase>;
        const ThumbsDown = (props) => <IconBase {...props}><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" /><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></IconBase>;
        const RotateCcw = (props) => <IconBase {...props}><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></IconBase>;
        const AlertTriangle = (props) => <IconBase {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></IconBase>;
        const HelpCircle = (props) => <IconBase {...props}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></IconBase>;
        const ArrowRight = (props) => <IconBase {...props}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></IconBase>;
        const BookOpen = (props) => <IconBase {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></IconBase>;
        const ChevronRight = (props) => <IconBase {...props}><polyline points="9 18 15 12 9 6" /></IconBase>;
        const CheckCircle = (props) => <IconBase {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></IconBase>;

        let fallbackAudio = null;

        const pickEnglishVoice = (voices) => (
            voices.find(v => v.lang === "en-US")
            || voices.find(v => v.lang && v.lang.startsWith("en-"))
            || voices.find(v => v.lang && v.lang.startsWith("en"))
            || null
        );

        const playAudioFallback = (text) => {
            if (typeof window === "undefined" || !text) return;
            try {
                const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(String(text))}`;
                if (fallbackAudio) {
                    fallbackAudio.pause();
                    fallbackAudio = null;
                }
                fallbackAudio = new Audio(url);
                fallbackAudio.play().catch(() => {
                    // Ignore fallback play errors.
                });
            } catch (e) {
                // Ignore fallback init errors.
            }
        };

        const speakWithVoice = (synth, text, voice) => {
            const utterance = new SpeechSynthesisUtterance(String(text));
            utterance.lang = "en-US";
            utterance.rate = 0.95;
            utterance.pitch = 1;
            utterance.volume = 1;
            if (voice) utterance.voice = voice;
            synth.cancel();
            if (synth.paused) synth.resume();
            synth.speak(utterance);
        };

        const speakEnglish = (text) => {
            if (!text || typeof window === "undefined") return;
            const synth = window.speechSynthesis;
            if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
                playAudioFallback(text);
                return;
            }

            try {
                const voices = synth.getVoices();
                const voice = pickEnglishVoice(voices);
                let didStart = false;
                let safetyTimer = null;

                const utterance = new SpeechSynthesisUtterance(String(text));
                utterance.lang = "en-US";
                utterance.rate = 0.95;
                utterance.pitch = 1;
                utterance.volume = 1;
                if (voice) utterance.voice = voice;
                utterance.onstart = () => {
                    didStart = true;
                    if (safetyTimer) clearTimeout(safetyTimer);
                };
                utterance.onend = () => {
                    if (safetyTimer) clearTimeout(safetyTimer);
                };
                utterance.onerror = () => {
                    if (safetyTimer) clearTimeout(safetyTimer);
                    playAudioFallback(text);
                };

                synth.cancel();
                if (synth.paused) synth.resume();
                synth.speak(utterance);

                // If Chrome silently fails to start speech, fallback to audio.
                safetyTimer = setTimeout(() => {
                    if (!didStart) {
                        synth.cancel();
                        playAudioFallback(text);
                    }
                }, 900);

                // Chrome can fail on first call before voices are fully ready.
                if (!voice) {
                    const retry = () => {
                        if (didStart) return;
                        const retryVoice = pickEnglishVoice(synth.getVoices());
                        if (retryVoice) {
                            if (safetyTimer) clearTimeout(safetyTimer);
                            speakWithVoice(synth, text, retryVoice);
                        }
                    };
                    if (typeof synth.addEventListener === "function") {
                        synth.addEventListener("voiceschanged", retry, { once: true });
                    } else {
                        const prev = synth.onvoiceschanged;
                        synth.onvoiceschanged = () => {
                            retry();
                            if (typeof prev === "function") prev();
                        };
                    }
                    setTimeout(retry, 250);
                }
            } catch (e) {
                playAudioFallback(text);
            }
        };

        // ========== FOLDERS CONFIG ==========
        const FOLDERS = [
            { key: 'who', label: 'だれが', color: 'bg-pink-100 border-pink-300 text-pink-900' },
            { key: 'does', label: 'する(です)', color: 'bg-green-100 border-green-300 text-green-900' },
            { key: 'what', label: 'だれ・なに', color: 'bg-blue-100 border-blue-300 text-blue-900' },
            { key: 'where', label: 'どこ', color: 'bg-yellow-100 border-yellow-300 text-yellow-900' },
            { key: 'how', label: '状態(状)', color: 'bg-orange-100 border-orange-300 text-orange-900' },
            { key: 'when', label: 'いつ', color: 'bg-purple-100 border-purple-300 text-purple-900' },
        ];

        const shuffleArray = (arr) => {
            const copy = [...arr];
            for (let i = copy.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            return copy;
        };

        const buildIndexQueue = (count, randomize = true) => {
            const arr = Array.from({ length: count }, (_, i) => i);
            return randomize ? shuffleArray(arr) : arr;
        };

        const normalizeEnglishForComparison = (text) => {
            let normalized = String(text || "")
                .toLowerCase()
                .replace(/[’`´]/g, "'")
                .replace(/\s+([,.!?;:])/g, "$1")
                .replace(/\s+/g, " ")
                .trim();

            const replacements = [
                [/\bwon'?t\b/g, "will not"],
                [/\bcan'?t\b/g, "can not"],
                [/\bshan'?t\b/g, "shall not"],
                [/\bain'?t\b/g, "am not"],
                [/\bdon'?t\b/g, "do not"],
                [/\bdoesn'?t\b/g, "does not"],
                [/\bdidn'?t\b/g, "did not"],
                [/\bhaven'?t\b/g, "have not"],
                [/\bhasn'?t\b/g, "has not"],
                [/\bhadn'?t\b/g, "had not"],
                [/\bwouldn'?t\b/g, "would not"],
                [/\bshouldn'?t\b/g, "should not"],
                [/\bcouldn'?t\b/g, "could not"],
                [/\bmustn'?t\b/g, "must not"],
                [/\baren'?t\b/g, "are not"],
                [/\bisn'?t\b/g, "is not"],
                [/\bwasn'?t\b/g, "was not"],
                [/\bweren'?t\b/g, "were not"],
                [/\bi'?m\b/g, "i am"],
                [/\byou'?re\b/g, "you are"],
                [/\bwe'?re\b/g, "we are"],
                [/\bthey'?re\b/g, "they are"],
                [/\bit'?s\b/g, "it is"],
                [/\bhe'?s\b/g, "he is"],
                [/\bshe'?s\b/g, "she is"],
                [/\bthat'?s\b/g, "that is"],
                [/\bthere'?s\b/g, "there is"],
                [/\bhere'?s\b/g, "here is"],
                [/\bwhat'?s\b/g, "what is"],
                [/\bwho'?s\b/g, "who is"],
                [/\blet'?s\b/g, "let us"],
                [/\bi'?ve\b/g, "i have"],
                [/\byou'?ve\b/g, "you have"],
                [/\bwe'?ve\b/g, "we have"],
                [/\bthey'?ve\b/g, "they have"]
            ];

            replacements.forEach(([pattern, value]) => {
                normalized = normalized.replace(pattern, value);
            });

            return normalized
                .replace(/[.!?]+$/g, "")
                .replace(/\s+/g, " ")
                .trim();
        };

        const areEnglishAnswersEquivalent = (userText, answerText) => (
            normalizeEnglishForComparison(userText) === normalizeEnglishForComparison(answerText)
        );

        const HIDDEN_COURSE_IDS = new Set([
            2024011601,
            2024011701,
            2024011702,
            2024011703,
            101,
            102
        ]);

        const useRetryQuestionFlow = (items = [], { randomize = true } = {}) => {
            const [queue, setQueue] = useState(() => buildIndexQueue(items.length, randomize));
            const [queuePos, setQueuePos] = useState(0);
            const [retryQueue, setRetryQueue] = useState([]);

            useEffect(() => {
                setQueue(buildIndexQueue(items.length, randomize));
                setQueuePos(0);
                setRetryQueue([]);
            }, [items, randomize]);

            const currentIndex = queue[queuePos];
            const currentItem = typeof currentIndex === "number" ? items[currentIndex] : null;

            const markWrong = () => {
                if (typeof currentIndex !== "number") return;
                setRetryQueue(prev => (prev.includes(currentIndex) ? prev : [...prev, currentIndex]));
            };

            const advance = (onComplete) => {
                if (queue.length === 0) {
                    if (typeof onComplete === "function") onComplete();
                    return;
                }
                if (queuePos < queue.length - 1) {
                    setQueuePos(prev => prev + 1);
                    return;
                }
                if (retryQueue.length > 0) {
                    const nextQueue = randomize ? shuffleArray(retryQueue) : [...retryQueue];
                    setQueue(nextQueue);
                    setQueuePos(0);
                    setRetryQueue([]);
                    return;
                }
                if (typeof onComplete === "function") onComplete();
            };

            return { queue, queuePos, currentIndex, currentItem, markWrong, advance };
        };

        // ========== COURSE SELECTION ==========
        const CourseSelect = ({ onSelect }) => (
            <div className="animate-fade-in max-w-2xl mx-auto p-4">
                <div className="space-y-3">
                    {COURSES.filter(course => !HIDDEN_COURSE_IDS.has(course.id)).map(course => (
                        <button
                            key={course.id}
                            onClick={() => onSelect(course)}
                            className="w-full bg-white p-5 rounded-xl shadow-md border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <BookOpen className="text-indigo-500" size={24} />
                                <span className="font-bold text-slate-800 text-left">{course.title}</span>
                            </div>
                            <ChevronRight className="text-slate-400 group-hover:text-indigo-500 transition" />
                        </button>
                    ))}
                </div>
            </div>
        );

        const AppHeader = ({ showHome, onHome }) => (
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-indigo-900">イミジュントレーニング</h1>
                    {showHome ? (
                        <button
                            onClick={onHome}
                            className="text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition"
                        >
                            ホームに戻る
                        </button>
                    ) : (
                        <div className="w-[110px]" />
                    )}
                </div>
            </header>
        );

        const toYouTubeEmbedUrl = (rawUrl) => {
            try {
                const url = new URL(rawUrl);
                const host = url.hostname.replace("www.", "");
                let videoId = "";

                if (host === "youtu.be") {
                    videoId = url.pathname.replace("/", "").trim();
                } else if (host === "youtube.com" || host === "m.youtube.com") {
                    if (url.pathname === "/watch") {
                        videoId = (url.searchParams.get("v") || "").trim();
                    } else if (url.pathname.startsWith("/embed/")) {
                        videoId = url.pathname.replace("/embed/", "").split("/")[0].trim();
                    } else if (url.pathname.startsWith("/shorts/")) {
                        videoId = url.pathname.replace("/shorts/", "").split("/")[0].trim();
                    }
                }

                if (!videoId) return null;
                return `https://www.youtube.com/embed/${videoId}?rel=0`;
            } catch (error) {
                return null;
            }
        };

        const VideoIntroStep = ({ course, onComplete }) => {
            const video = course?.introVideo;
            if (!video) return null;
            const embedUrl = toYouTubeEmbedUrl(video.url);

            return (
                <div className="animate-fade-in max-w-3xl mx-auto p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">最初に動画を見てください</h2>
                        <p className="text-slate-600 mb-2">{course.title}</p>
                        <p className="text-slate-500 mb-6">{video.title}</p>

                        <div className="mb-6">
                            <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden border border-slate-200 bg-black">
                                {embedUrl ? (
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={embedUrl}
                                        title={video.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    />
                                ) : (
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 flex items-center justify-center text-white font-bold hover:underline"
                                    >
                                        動画を開く
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                            >
                                別タブで開く
                            </a>
                            <button
                                onClick={onComplete}
                                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                            >
                                動画を見たので次へ
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        // ========== STEP 2: FLASHCARD ==========
        const FlashcardStep = ({ flashcards, onComplete }) => {
            const flow = useRetryQuestionFlow(flashcards, { randomize: false });
            const [isFlipped, setIsFlipped] = useState(false);
            const [resetMessage, setResetMessage] = useState("");
            const [masteredIds, setMasteredIds] = useState(new Set());
            const currentCard = flow.currentItem;

            useEffect(() => {
                setMasteredIds(new Set());
            }, [flashcards]);

            useEffect(() => {
                if (!currentCard && flashcards.length > 0) onComplete();
            }, [currentCard, flashcards, onComplete]);

            if (!currentCard) return null;

            const handleKnown = (e) => {
                e.stopPropagation();
                setIsFlipped(false);
                setMasteredIds(prev => {
                    const next = new Set(prev);
                    next.add(currentCard.id);
                    return next;
                });
                flow.advance(onComplete);
            };
            const handleUnknown = (e) => {
                e.stopPropagation();
                setIsFlipped(false);
                flow.markWrong();
                flow.advance(onComplete);
                setResetMessage("あとで再出題します");
                setTimeout(() => setResetMessage(""), 2000);
            };

            return (
                <div className="flex flex-col items-center animate-fade-in max-w-2xl mx-auto w-full relative p-4">
                    <div className="flex justify-between w-full items-center mb-4">
                        <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2"><Brain className="text-indigo-500" /> 一問一答</h3>
                        <button onClick={onComplete} className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded hover:bg-slate-300 transition">Skip Step</button>
                    </div>
                    {resetMessage && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white/80 rounded-xl backdrop-blur-sm animate-bounce">
                            <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-xl font-bold text-lg flex items-center gap-2"><AlertTriangle /> {resetMessage}</div>
                        </div>
                    )}
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-6 overflow-hidden"><div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(masteredIds.size / flashcards.length) * 100}%` }}></div></div>
                    <p className="text-slate-500 text-sm mb-4">習得済み: <span className="font-bold text-indigo-600">{masteredIds.size}</span> / {flashcards.length}</p>
                    <div className="w-full h-80 cursor-pointer group mb-8" onClick={() => setIsFlipped(!isFlipped)}>
                        {!isFlipped ? (
                            <div className="w-full h-full bg-white border-2 border-indigo-100 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center hover:border-indigo-300 transition-colors relative">
                                <span className="absolute top-4 left-4 bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">Question</span>
                                <h4 className="text-2xl font-bold text-slate-800">{currentCard.front}</h4>
                                <p className="text-slate-400 text-sm mt-8 flex items-center gap-2"><RotateCcw size={14} /> タップして答えを見る</p>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-indigo-600 text-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center relative">
                                <span className="absolute top-4 left-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">Answer</span>
                                <div className="text-xl font-bold whitespace-pre-wrap leading-relaxed">{currentCard.back}</div>
                                <div className="mt-6 pt-4 border-t border-white/20 text-sm text-indigo-100 w-full">Hint: {currentCard.hint}</div>
                            </div>
                        )}
                    </div>
                    {isFlipped ? (
                        <div className="flex gap-4 w-full">
                            <button onClick={handleUnknown} className="flex-1 bg-red-100 text-red-600 py-4 rounded-xl font-bold flex flex-col items-center hover:bg-red-200 active:scale-95 transition"><ThumbsDown size={24} className="mb-1" /><span className="text-xs">あとで再挑戦</span></button>
                            <button onClick={handleKnown} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold flex flex-col items-center hover:bg-indigo-700 active:scale-95 transition shadow-lg"><ThumbsUp size={24} className="mb-1" /><span className="text-xs">覚えた！</span></button>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm mt-4 h-16 flex items-center">答えを確認してください</p>
                    )}
                </div>
            );
        };


        // ========== STEP 2: FILL-IN ==========
        const FillInStep = ({ questions, fillInQuestions, onComplete }) => {
            const [feedback, setFeedback] = useState("");
            const [isCorrect, setIsCorrect] = useState(false);
            const [showCorrection, setShowCorrection] = useState(false);
            const hasCustomFillIn = Array.isArray(fillInQuestions) && fillInQuestions.length > 0;
            const activeQuestions = hasCustomFillIn ? fillInQuestions : questions;
            const flow = useRetryQuestionFlow(activeQuestions, { randomize: true });
            const currentQIndex = typeof flow.currentIndex === "number" ? flow.currentIndex : 0;
            const currentQ = flow.currentItem;
            const rawCustomTranslation = hasCustomFillIn ? (currentQ?.translation || "").trim() : "";
            const wrappedTranslation = rawCustomTranslation.match(/^[（(]\s*([\s\S]*?)\s*[）)]$/);
            const customTranslationText = wrappedTranslation ? wrappedTranslation[1] : rawCustomTranslation;

            useEffect(() => {
                if (activeQuestions.length === 0) onComplete();
            }, [activeQuestions, onComplete]);

            // Target the 'does' part (or other parts if configured)
            const targetRow = hasCustomFillIn ? null : currentQ?.rows?.[0];
            const targetPart = 'does';
            const answerFull = hasCustomFillIn
                ? (currentQ?.answer || "")
                : (targetRow?.structure?.[targetPart]?.en || "");
            const fullAnswerText = hasCustomFillIn
                ? answerFull
                : [
                    currentQ?.rows?.[0]?.structure?.who?.en,
                    answerFull,
                    currentQ?.rows?.[0]?.structure?.what?.en,
                    currentQ?.rows?.[0]?.structure?.where?.en,
                    currentQ?.rows?.[0]?.structure?.when?.en
                ].filter(Boolean).join(" ");

            // Analyze answer for split pattern (e.g., "Do ... like")
            const { preWords, postWords, allWords } = useMemo(() => {
                const isSplit = answerFull.includes("...");
                let pre = [];
                let post = [];

                if (isSplit) {
                    const parts = answerFull.split("...");
                    if (parts[0]) pre = parts[0].trim().split(/\s+/);
                    if (parts[1]) post = parts[1].trim().split(/\s+/);
                } else {
                    const trimmed = answerFull.trim();
                    post = trimmed ? trimmed.split(/\s+/) : [];
                }

                return {
                    preWords: pre,
                    postWords: post,
                    allWords: [...pre, ...post]
                };
            }, [answerFull]);

            // State for multiple inputs
            const [inputValues, setInputValues] = useState([]);

            // Initialize inputs when question changes
            useEffect(() => {
                setInputValues(new Array(allWords.length).fill(""));
                setFeedback("");
                setIsCorrect(false);
                setShowCorrection(false);

                // Focus first input after render
                setTimeout(() => {
                    const firstInput = document.getElementById('fill-input-0');
                    if (firstInput) firstInput.focus();
                }, 100);
            }, [currentQIndex, allWords.length]);

            const handleInputChange = (index, val) => {
                const newInputs = [...inputValues];
                newInputs[index] = val;
                setInputValues(newInputs);
            };

            const nextQuestion = () => flow.advance(onComplete);
            const skipQuestion = () => flow.advance(onComplete);

            const handleSubmit = (e) => {
                e.preventDefault();
                if (allWords.length === 0) return;

                // Check if all inputs match their corresponding words (case-insensitive)
                const isAllCorrect = inputValues.every((val, index) => {
                    return val.trim().toLowerCase() === allWords[index].toLowerCase();
                });

                if (isAllCorrect) {
                    setFeedback("Correct! 正解です！");
                    setIsCorrect(true);
                    setTimeout(() => {
                        nextQuestion();
                    }, 1000);
                } else {
                    setFeedback("Not yet. 正解を確認して次へ進みましょう。");
                    flow.markWrong();
                    setShowCorrection(true);
                    speakEnglish(fullAnswerText || answerFull);
                }
            };

            // Helper to focus next input
            const handleKeyDown = (e, index) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (index < inputValues.length - 1) {
                        // Focus next input
                        const nextInput = document.getElementById(`fill-input-${index + 1}`);
                        if (nextInput) nextInput.focus();
                    } else {
                        // Submit if last input
                        handleSubmit(e);
                    }
                }
            };

            // Helper to render input group
            const renderInputs = (words, startIndex) => (
                <span className="mx-2 inline-flex gap-2 flex-wrap justify-center">
                    {words.map((word, i) => {
                        const actualIndex = startIndex + i;
                        return (
                            <input
                                key={actualIndex}
                                id={`fill-input-${actualIndex}`}
                                type="text"
                                value={inputValues[actualIndex] || ""}
                                onChange={(e) => handleInputChange(actualIndex, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, actualIndex)}
                                disabled={showCorrection}
                                className={`border-b-2 text-center text-indigo-600 font-bold outline-none transition-colors ${isCorrect
                                    ? 'border-green-500 text-green-600 bg-green-50'
                                    : 'border-indigo-600 focus:border-indigo-800 bg-white'
                                    }`}
                                // Adjust width based on word length, min 3ch
                                style={{ width: `${Math.max(word.length * 1.2, 3)}ch` }}
                                placeholder="?"
                                autoComplete="off"
                            />
                        );
                    })}
                </span>
            );

            if (!currentQ) return null;

            return (
                <div className="animate-fade-in w-full p-4 max-w-2xl mx-auto">
                    <div className="flex justify-between w-full items-center mb-6">
                        <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2"><Layers className="text-indigo-500" /> 穴埋め問題</h3>
                        <button onClick={skipQuestion} className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded hover:bg-slate-300 transition">Skip Question</button>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{hasCustomFillIn ? `Question ${flow.queuePos + 1}` : currentQ.original}</h2>
                        {hasCustomFillIn ? (
                            <>
                                {customTranslationText && (
                                    <div className="mb-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-left">
                                        <p className="text-xs font-bold text-indigo-500 tracking-wide mb-1">問題文</p>
                                        <p className="text-lg font-bold text-slate-800">{customTranslationText}</p>
                                    </div>
                                )}
                                <div className="text-2xl font-mono mb-6 bg-slate-50 p-6 rounded-lg inline-block w-full leading-loose">
                                    {(() => {
                                        const prompt = currentQ.prompt || "";
                                        const placeholderPattern = /\(\s*\)/g;
                                        const parts = prompt.split(placeholderPattern);
                                        const placeholderCount = (prompt.match(placeholderPattern) || []).length;

                                        if (placeholderCount > 0 && parts.length === placeholderCount + 1) {
                                            return (
                                                <>
                                                    {parts.map((part, i) => (
                                                        <React.Fragment key={`blank-part-${i}`}>
                                                            {part}
                                                            {i < placeholderCount && renderInputs([allWords[i] || ""], i)}
                                                        </React.Fragment>
                                                    ))}
                                                </>
                                            );
                                        }
                                        return (
                                            <>
                                                {prompt}
                                                {allWords.length > 0 && renderInputs(allWords, 0)}
                                            </>
                                        );
                                    })()}
                                </div>
                            </>
                        ) : (
                            <div className="text-2xl font-mono mb-8 bg-slate-50 p-6 rounded-lg inline-block w-full leading-loose">
                                {/* Pre-Who Inputs (Part 1 of split answer) */}
                                {preWords.length > 0 && renderInputs(preWords, 0)}

                                {currentQ.rows[0].structure.who.en}

                                {/* Post-Who Inputs (Part 2 of split answer or full answer if not split) */}
                                {postWords.length > 0 && renderInputs(postWords, preWords.length)}

                                {currentQ.rows[0].structure.what?.en} {currentQ.rows[0].structure.where?.en} {currentQ.rows[0].structure.when?.en}
                            </div>
                        )}

                        {showCorrection && (
                            <div className="mb-4 bg-slate-50 rounded-xl p-4">
                                <p className="text-xs font-bold text-slate-500 tracking-wide mb-2">正解</p>
                                <p className="text-xl font-mono font-bold text-slate-800">{fullAnswerText || answerFull}</p>
                            </div>
                        )}
                        <div className="flex justify-center">
                            {showCorrection ? (
                                <button
                                    onClick={nextQuestion}
                                    className="bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition shadow-lg"
                                >
                                    次へ
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={allWords.length === 0 || inputValues.some(v => !v.trim())}
                                >
                                    Check Answer
                                </button>
                            )}
                        </div>
                        <div className={`h-8 mt-4 font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>{feedback}</div>
                    </div>
                </div>
            );
        };

        // ========== STEP: INSTANT ENGLISH OUTPUT ==========
        const InstantStep = ({ questions = [], onComplete }) => {
            const flow = useRetryQuestionFlow(questions, { randomize: true });
            const [showAnswer, setShowAnswer] = useState(false);
            const [feedback, setFeedback] = useState("");
            const currentQ = flow.currentItem;

            useEffect(() => {
                if (questions.length === 0) onComplete();
            }, [questions, onComplete]);

            const nextQuestion = ({ markWrong = false } = {}) => {
                if (markWrong) flow.markWrong();
                flow.advance(onComplete);
                setShowAnswer(false);
                setFeedback("");
            };

            const revealAnswer = () => {
                if (!currentQ) return;
                setShowAnswer(true);
                speakEnglish(currentQ.answer);
            };

            if (!currentQ) return null;

            return (
                <div className="animate-fade-in w-full p-4 max-w-2xl mx-auto">
                    <div className="flex justify-between w-full items-center mb-6">
                        <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2"><Layers className="text-indigo-500" /> 瞬間英作文</h3>
                        <button onClick={() => nextQuestion()} className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded hover:bg-slate-300 transition">Skip Question</button>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Question {flow.queuePos + 1}</h2>
                        <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-left">
                            <p className="text-xs font-bold text-indigo-500 tracking-wide mb-1">問題文</p>
                            <p className="text-lg font-bold text-slate-800">{currentQ.jp}</p>
                        </div>

                        {showAnswer ? (
                            <div className="mb-6 bg-slate-50 rounded-xl p-6">
                                <p className="text-xs font-bold text-slate-500 tracking-wide mb-2">解答（英語）</p>
                                <p className="text-2xl font-mono font-bold text-slate-800">{currentQ.answer}</p>
                                <div className="mt-4">
                                    <button
                                        onClick={() => speakEnglish(currentQ.answer)}
                                        className="text-sm bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-100 transition"
                                    >
                                        発音を再生
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">聞こえない場合は端末の消音と音量を確認して、もう一度「発音を再生」を押してください。</p>
                            </div>
                        ) : (
                            <div className="mb-6">
                                <button
                                    onClick={revealAnswer}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg"
                                >
                                    解答を確認
                                </button>
                            </div>
                        )}

                        {showAnswer && (
                            <div className="flex justify-center gap-3 flex-wrap">
                                <button onClick={() => { setFeedback("OK!"); nextQuestion(); }} className="bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition">
                                    言えた
                                </button>
                                <button onClick={() => { setFeedback("次で取り返そう"); nextQuestion({ markWrong: true }); }} className="bg-slate-500 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-600 transition">
                                    言えなかった
                                </button>
                            </div>
                        )}
                        <div className="h-6 mt-4 font-bold text-indigo-600">{feedback}</div>
                    </div>
                </div>
            );
        };

        // ========== STEP: WRITING ENGLISH OUTPUT ==========
        const WritingStep = ({ questions = [], onComplete }) => {
            const flow = useRetryQuestionFlow(questions, { randomize: true });
            const [inputValue, setInputValue] = useState("");
            const [feedback, setFeedback] = useState("");
            const [checked, setChecked] = useState(false);
            const currentQ = flow.currentItem;

            useEffect(() => {
                if (questions.length === 0) onComplete();
            }, [questions, onComplete]);

            const nextQuestion = ({ markWrong = false } = {}) => {
                if (markWrong) flow.markWrong();
                flow.advance(onComplete);
                setInputValue("");
                setFeedback("");
                setChecked(false);
            };

            const checkAnswer = () => {
                if (!currentQ) return;
                const isCorrect = areEnglishAnswersEquivalent(inputValue, currentQ.answer);
                setChecked(true);
                setFeedback(isCorrect ? "Correct! 正解です！" : "Not yet. 正しい答えを確認して次へ。");
                speakEnglish(currentQ.answer);
                if (!isCorrect) flow.markWrong();
            };

            if (!currentQ) return null;

            return (
                <div className="animate-fade-in w-full p-4 max-w-2xl mx-auto">
                    <div className="flex justify-between w-full items-center mb-6">
                        <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2"><Layers className="text-indigo-500" /> 記述英作文</h3>
                        <button onClick={() => nextQuestion()} className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded hover:bg-slate-300 transition">Skip Question</button>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Question {flow.queuePos + 1}</h2>
                        <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-left">
                            <p className="text-xs font-bold text-indigo-500 tracking-wide mb-1">問題文</p>
                            <p className="text-lg font-bold text-slate-800">{currentQ.jp}</p>
                        </div>

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="英語を入力"
                            className="w-full border border-slate-300 rounded-lg p-3 text-center text-lg font-mono text-slate-800 mb-4"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !checked && inputValue.trim()) checkAnswer();
                            }}
                        />

                        {checked && (
                            <div className="mb-4 bg-slate-50 rounded-xl p-4">
                                <p className="text-xs font-bold text-slate-500 tracking-wide mb-2">正しい英語</p>
                                <p className="text-xl font-mono font-bold text-slate-800">{currentQ.answer}</p>
                                <div className="mt-3">
                                    <button
                                        onClick={() => speakEnglish(currentQ.answer)}
                                        className="text-sm bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-100 transition"
                                    >
                                        発音を再生
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">聞こえない場合は端末の消音と音量を確認して、もう一度「発音を再生」を押してください。</p>
                            </div>
                        )}

                        <div className="flex justify-center">
                            {!checked ? (
                                <button
                                    onClick={checkAnswer}
                                    disabled={!inputValue.trim()}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    解答を確認
                                </button>
                            ) : (
                                <button
                                    onClick={nextQuestion}
                                    className="bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition shadow-lg"
                                >
                                    次へ
                                </button>
                            )}
                        </div>
                        <div className={`h-8 mt-4 font-bold ${feedback.includes("Correct") ? "text-green-600" : "text-indigo-600"}`}>{feedback}</div>
                    </div>
                </div>
            );
        };

        // ========== STEP 3: ERROR CORRECTION ==========
        const ErrorStep = ({ questions, onComplete, course }) => {
            const flow = useRetryQuestionFlow(questions, { randomize: true });
            const currentQ = flow.currentItem;
            const PART_KEYS = ['does_pre', 'who', 'does', 'what', 'where', 'when'];

            const [phase, setPhase] = useState('judge'); // judge -> select_part -> fix_part -> result
            const [judgeChoice, setJudgeChoice] = useState(null); // correct | incorrect
            const [selectedPart, setSelectedPart] = useState(null);
            const [inputValue, setInputValue] = useState("");
            const [feedback, setFeedback] = useState("");
            const [explanation, setExplanation] = useState("");

            useEffect(() => {
                if (questions.length === 0) onComplete();
            }, [questions, onComplete]);

            const resetLocalState = () => {
                setPhase('judge');
                setJudgeChoice(null);
                setSelectedPart(null);
                setInputValue("");
                setFeedback("");
                setExplanation("");
            };

            useEffect(() => {
                resetLocalState();
            }, [flow.currentIndex]);

            const errorData = useMemo(() => {
                if (!currentQ) {
                    return { part: 'does', wrong: "", correct: "", sentenceParts: {}, isCorrectSentence: false };
                }
                if (currentQ.error) return { isCorrectSentence: false, ...currentQ.error };

                const targetRow = currentQ.rows[0];
                const correctText = targetRow.structure.does.en;
                const dummyText = currentQ.enOptions?.find(o => o.category === 'dummy')?.text || "wrong";
                return {
                    part: 'does',
                    wrong: dummyText,
                    correct: correctText,
                    isCorrectSentence: false,
                    sentenceParts: {
                        who: targetRow.structure.who.en,
                        does: dummyText,
                        what: targetRow.structure.what?.en,
                        where: targetRow.structure.where?.en,
                        when: targetRow.structure.when?.en
                    }
                };
            }, [currentQ]);

            const isCorrectSentence = Boolean(errorData.isCorrectSentence);
            const activePartKey = PART_KEYS.includes(errorData.part) ? errorData.part : 'does';

            const jpPrompt = useMemo(() => {
                const hasJapanese = (text) => /[ぁ-んァ-ン一-龯]/.test(String(text || ""));

                if (currentQ?.jp) return currentQ.jp;
                if (currentQ?.translationJa) return currentQ.translationJa;
                if (currentQ?.translationJP) return currentQ.translationJP;
                if (currentQ?.original && hasJapanese(currentQ.original)) return currentQ.original;

                const matched = course?.questions?.find(q => q.id === currentQ?.id);
                if (matched?.jp) return matched.jp;
                if (matched?.original && hasJapanese(matched.original)) return matched.original;

                return "";
            }, [currentQ, course]);

            const correctedSentence = useMemo(() => {
                return PART_KEYS
                    .map(key => {
                        const text = errorData.sentenceParts?.[key];
                        if (!text) return null;
                        if (!isCorrectSentence && key === activePartKey && errorData.correct) return errorData.correct;
                        return text;
                    })
                    .filter(Boolean)
                    .join(" ");
            }, [errorData, activePartKey, isCorrectSentence]);

            const buildExplanation = () => {
                if (isCorrectSentence) {
                    return "この文は文法的に正しい文です。";
                }
                const wrongText = errorData.wrong || "誤り";
                const correctText = errorData.correct || "正しい形";
                const wrongLower = String(wrongText).toLowerCase();
                const correctLower = String(correctText).toLowerCase();
                const ensureReasonEnding = (text) => {
                    const cleaned = String(text || "").trim().replace(/[。.!?]+$/g, "");
                    if (!cleaned) return "";
                    return cleaned.endsWith("から") ? `${cleaned}。` : `${cleaned}から。`;
                };

                const reasons = [];

                // be動詞疑問文: 主語とbe動詞を逆にする
                if (
                    activePartKey === 'does_pre' &&
                    (
                        (/(^|\s)(are|is)\b/.test(correctLower) && /(you are|this is|my pen is)/.test(wrongLower))
                        || (wrongLower === 'is' && correctLower === 'are')
                        || (wrongLower === 'does' && correctLower === 'is')
                        || (wrongLower === 'does' && correctLower === 'are')
                    )
                ) {
                    reasons.push("be動詞の疑問文は、主語とbe動詞を逆にする");
                }

                // 一般動詞疑問文: Do / Does を文頭に置く
                if (
                    activePartKey === 'does_pre' &&
                    (correctLower === 'do' || correctLower === 'does' || correctLower.startsWith("do ") || correctLower.startsWith("does "))
                ) {
                    reasons.push("一般動詞の疑問文は文頭にDoかDoesを置く");
                    if (correctLower.includes("does") || correctLower === "does") {
                        reasons.push("主語がIとyou以外の単数のときはDoesを使う");
                    }
                }

                // Does の後ろは原形
                if (
                    activePartKey === 'does' &&
                    (
                        (wrongLower.includes("plays") && correctLower.includes("play"))
                        || (wrongLower.includes("gets") && correctLower.includes("get"))
                        || (wrongLower.includes("studies") && correctLower.includes("study"))
                    )
                ) {
                    reasons.push("Doesを使う疑問文では、後ろの動詞は原形に戻す");
                }

                // 回答の主語は代名詞（this/thatは不可）
                if (
                    (wrongLower.includes(" this ") || wrongLower.startsWith("this ") || wrongLower.includes(" that ") || wrongLower.startsWith("that "))
                    && (correctLower.includes(" it ") || correctLower.startsWith("it "))
                ) {
                    reasons.push("答えの主語は代名詞に置き換える");
                    reasons.push("答えの主語にthisやthatは使わず、itを使う");
                }

                // 一般動詞疑問文の答え方（do/does/don't/doesn't）
                if (
                    (wrongLower.includes(" yes, i am") && correctLower.includes(" yes, i do"))
                    || (wrongLower.includes("no, she does") && correctLower.includes("no, she doesn't"))
                ) {
                    reasons.push("一般動詞の疑問文への返答はdo / does / don't / doesn'tを使う");
                }

                // No で答えるなら not が必要
                if (correctLower.includes("no,") && (correctLower.includes(" not") || correctLower.includes("n't"))) {
                    reasons.push("Noで答えるときはnotを入れる");
                }

                const uniqueReasons = [...new Set(reasons.map(ensureReasonEnding).filter(Boolean))];
                const reasonText = uniqueReasons.length > 0
                    ? ` 理由: ${uniqueReasons.join(" ")}`
                    : "";

                return `解説: 「${wrongText}」ではなく「${correctText}」を使います。${reasonText}`;
            };

            const nextQuestion = () => {
                resetLocalState();
                flow.advance(onComplete);
            };

            const handleJudgeSubmit = () => {
                if (!judgeChoice) {
                    setFeedback("まず「正しい / 間違っている」を選んでください。");
                    return;
                }

                if (isCorrectSentence) {
                    if (judgeChoice === 'correct') {
                        setFeedback("正解です。");
                        setExplanation(buildExplanation());
                        setPhase('result');
                    } else {
                        flow.markWrong();
                        setFeedback("不正解です。この文は正しい文です。");
                    }
                    return;
                }

                if (judgeChoice === 'incorrect') {
                    setFeedback("正解です。次は間違い箇所を選んでください。");
                    setPhase('select_part');
                } else {
                    flow.markWrong();
                    setFeedback("不正解です。この文は間違っています。");
                }
            };

            const handlePartClick = (partKey) => {
                if (phase !== 'select_part') return;
                setSelectedPart(partKey);
                setFeedback("");
            };

            const handlePartSubmit = () => {
                if (!selectedPart) {
                    setFeedback("間違い箇所をタップしてから回答してください。");
                    return;
                }
                if (selectedPart === activePartKey) {
                    setFeedback("正解です。修正して回答してください。");
                    setInputValue("");
                    setPhase('fix_part');
                } else {
                    flow.markWrong();
                    setFeedback("不正解です。もう一度、間違い箇所を選んでください。");
                }
            };

            const handleFixSubmit = (e) => {
                if (e) e.preventDefault();
                if (!inputValue.trim()) {
                    setFeedback("修正内容を入力してください。");
                    return;
                }

                if (areEnglishAnswersEquivalent(inputValue, errorData.correct)) {
                    setFeedback("正解です。");
                    setExplanation(buildExplanation());
                    setPhase('result');
                } else {
                    flow.markWrong();
                    setFeedback("不正解です。もう一度修正してください。");
                }
            };

            if (!currentQ) return null;

            return (
                <div className="animate-fade-in w-full p-4 max-w-2xl mx-auto">
                    <div className="flex justify-between w-full items-center mb-6">
                        <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2"><AlertTriangle className="text-indigo-500" /> 間違い探し</h3>
                        <button onClick={nextQuestion} className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded hover:bg-slate-300 transition">Skip Question</button>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                        <p className="text-slate-500 mb-4 font-bold">
                            {phase === 'judge' && "1. まず、文が正しいか間違っているかを判断してください。"}
                            {phase === 'select_part' && "2. 間違っている箇所をタップして、回答してください。"}
                            {phase === 'fix_part' && "3. 選んだ箇所を正しく修正して、回答してください。"}
                            {phase === 'result' && "4. 判定結果と解説です。"}
                        </p>

                        {jpPrompt && (
                            <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-left">
                                <p className="text-xs font-bold text-indigo-500 tracking-wide mb-1">日本語訳</p>
                                <p className="text-lg font-bold text-slate-800">{jpPrompt}</p>
                            </div>
                        )}

                        <div className="flex justify-center gap-2 flex-wrap font-mono text-xl mb-8 items-end min-h-[4rem]">
                            {PART_KEYS.map(key => {
                                const text = errorData.sentenceParts?.[key];
                                if (!text) return null;

                                const isSelected = selectedPart === key;
                                const isErrorPart = key === activePartKey;
                                const showInput = phase === 'fix_part' && isSelected;
                                const showCorrect = phase === 'result' && !isCorrectSentence && isErrorPart;

                                return (
                                    <div key={key} className="flex flex-col items-center gap-2">
                                        {showInput ? (
                                            <form onSubmit={handleFixSubmit}>
                                                <input
                                                    type="text"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    className="border-b-2 border-indigo-600 text-center text-indigo-600 font-bold outline-none w-36 bg-indigo-50"
                                                    placeholder="修正を入力"
                                                    autoFocus
                                                />
                                            </form>
                                        ) : showCorrect ? (
                                            <span className="text-green-600 font-bold border-b-2 border-green-500 px-2 py-1">{errorData.correct}</span>
                                        ) : (
                                            <button
                                                onClick={() => handlePartClick(key)}
                                                disabled={phase !== 'select_part'}
                                                className={`px-2 py-1 rounded transition border-2 ${phase === 'select_part'
                                                    ? 'border-transparent hover:border-red-200 hover:bg-red-50'
                                                    : 'border-transparent cursor-default'} ${isSelected ? 'bg-indigo-100 border-indigo-300' : ''}`}
                                            >
                                                {text}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {phase === 'judge' && (
                            <div className="mb-4">
                                <div className="flex justify-center gap-3 mb-4">
                                    <button
                                        onClick={() => setJudgeChoice('incorrect')}
                                        className={`px-5 py-2 rounded-full font-bold border ${judgeChoice === 'incorrect'
                                            ? 'bg-red-500 text-white border-red-500'
                                            : 'bg-white text-red-500 border-red-300'}`}
                                    >
                                        間違っている
                                    </button>
                                    <button
                                        onClick={() => setJudgeChoice('correct')}
                                        className={`px-5 py-2 rounded-full font-bold border ${judgeChoice === 'correct'
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-white text-green-600 border-green-300'}`}
                                    >
                                        正しい
                                    </button>
                                </div>
                                <button onClick={handleJudgeSubmit} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition">
                                    回答する
                                </button>
                            </div>
                        )}

                        {phase === 'select_part' && (
                            <div className="mb-4">
                                <button onClick={handlePartSubmit} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition">
                                    回答する
                                </button>
                            </div>
                        )}

                        {phase === 'fix_part' && (
                            <div className="mb-4">
                                <button onClick={handleFixSubmit} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition">
                                    回答する
                                </button>
                            </div>
                        )}

                        {phase === 'result' && (
                            <div className="mb-4">
                                <div className="mb-4 bg-slate-50 rounded-xl p-4 text-left">
                                    <p className="text-xs font-bold text-slate-500 tracking-wide mb-1">解説</p>
                                    <p className="text-slate-700 font-bold">{explanation}</p>
                                    {!isCorrectSentence && correctedSentence && (
                                        <>
                                            <p className="text-xs font-bold text-slate-500 tracking-wide mt-3 mb-1">正しい文</p>
                                            <p className="text-slate-900 font-mono">{correctedSentence}</p>
                                        </>
                                    )}
                                </div>
                                <button onClick={nextQuestion} className="bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition">
                                    次に進む
                                </button>
                            </div>
                        )}

                        <div className={`h-8 mt-4 font-bold ${feedback.includes("正解") ? 'text-green-600' : 'text-indigo-600'}`}>{feedback}</div>
                    </div>
                </div>
            );
        };

        // ========== STEP 4 & 5: TRAINING (Sort & Composition) ==========
        const TrainingStep = ({ questions, mode = "sort", onComplete, course }) => {
            const flow = useRetryQuestionFlow(questions, { randomize: true });
            const currentQIndex = typeof flow.currentIndex === "number" ? flow.currentIndex : 0;
            const activeFolders = useMemo(
                () => (
                    Array.isArray(course?.sortFolders) && course.sortFolders.length > 0
                        ? course.sortFolders
                        : FOLDERS
                ),
                [course]
            );
            const showInactiveSortBoxes = course?.showInactiveSortBoxes !== false;

            // Phases: 'selection' -> 'sort_jp' -> 'sort_en' (for mode='sort')
            // Phases: 'composition_input' (for mode='composition')
            const [phase, setPhase] = useState(mode === 'composition' ? 'composition_input' : 'sort_jp');

            const [slots, setSlots] = useState({});
            const [selectedCard, setSelectedCard] = useState(null);
            const [draggedCard, setDraggedCard] = useState(null);
            const [feedback, setFeedback] = useState("");
            const [showHint, setShowHint] = useState(false);
            const [compositionCorrection, setCompositionCorrection] = useState("");

            // Composition Input State
            const [inputs, setInputs] = useState({}); // { rowId_folderKey: "value" }

            const currentQ = flow.currentItem;

            useEffect(() => {
                if (questions.length === 0) onComplete();
            }, [questions, onComplete]);

            const buildOptionsFromRows = (rows = [], lang = "jp") => {
                const built = [];
                let counter = 0;
                rows.forEach(row => {
                    activeFolders.forEach(folder => {
                        const text = row.structure?.[folder.key]?.[lang];
                        if (text) {
                            counter += 1;
                            built.push({
                                id: `auto-${lang}-${row.id}-${folder.key}-${counter}`,
                                text,
                                category: folder.key
                            });
                        }
                    });
                });
                return built;
            };

            const { shuffledJpOptions, shuffledEnOptions } = useMemo(() => {
                if (!currentQ) return { shuffledJpOptions: [], shuffledEnOptions: [] };

                const getCorrectOnly = (options, lang) => {
                    const expectedTexts = [];
                    currentQ.rows.forEach(row => {
                        activeFolders.forEach(f => {
                            const val = row.structure[f.key];
                            if (val && val[lang]) {
                                expectedTexts.push(val[lang]);
                            }
                        });
                    });

                    const correctOptions = [];
                    const remainingExpected = [...expectedTexts];

                    options.forEach(opt => {
                        const idx = remainingExpected.indexOf(opt.text);
                        if (idx !== -1) {
                            correctOptions.push(opt);
                            remainingExpected.splice(idx, 1);
                        }
                    });

                    // Shuffle
                    return correctOptions.sort(() => Math.random() - 0.5);
                };

                const sourceJpOptions = (currentQ.jpOptions && currentQ.jpOptions.length > 0)
                    ? currentQ.jpOptions
                    : buildOptionsFromRows(currentQ.rows, 'jp');
                const sourceEnOptions = (currentQ.enOptions && currentQ.enOptions.length > 0)
                    ? currentQ.enOptions
                    : buildOptionsFromRows(currentQ.rows, 'en');

                return {
                    shuffledJpOptions: getCorrectOnly(sourceJpOptions, 'jp'),
                    shuffledEnOptions: getCorrectOnly(sourceEnOptions, 'en')
                };
            }, [currentQ, activeFolders]);

            // Selection Options (Memoized)
            const selectionOptions = useMemo(() => {
                if (mode === 'composition') return [];
                if (!currentQ) return [];
                const correct = currentQ.translation;
                const dummies = questions
                    .filter(q => q.id !== currentQ.id)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 2)
                    .map(q => q.translation);
                return [correct, ...dummies].sort(() => 0.5 - Math.random());
            }, [currentQ, questions, mode]);

            useEffect(() => {
                // Reset state on Question Change
                if (currentQ?.rows) {
                    const initialSlots = {};
                    currentQ.rows.forEach(row => {
                        initialSlots[row.id] = {};
                        activeFolders.forEach(folder => {
                            initialSlots[row.id][folder.key] = {
                                jp: mode === 'composition' ? row.structure?.[folder.key]?.jp : null,
                                en: null
                            };
                        });
                    });
                    setSlots(initialSlots);
                    setInputs({});
                    setPhase(mode === 'composition' ? 'composition_input' : 'sort_jp');
                    setFeedback("");
                    setShowHint(false);
                    setCompositionCorrection("");
                    setIsPhaseComplete(false); // Reset check answer state
                }
            }, [currentQIndex, mode, questions]); // Added questions to dependency just in case

            const nextQuestion = () => flow.advance(onComplete);

            // --- Selection Phase Logic ---
            const handleSelection = (text) => {
                if (text === currentQ.translation) {
                    setFeedback("Correct! Next: Sort Japanese.");
                    setTimeout(() => {
                        setFeedback("");
                        setPhase('sort_jp');
                    }, 800);
                } else {
                    setFeedback("Try again.");
                }
            };


            // --- Sort Phase Logic (JP & EN) ---
            const [isPhaseComplete, setIsPhaseComplete] = useState(false);

            // New logic: Just place the card in the first available slot. No immediate validation.
            const handleCardClick = (item, type) => {
                const targetLang = type;
                let foundSlot = false;
                const newSlots = JSON.parse(JSON.stringify(slots));

                for (const row of currentQ.rows) {
                    for (const folder of activeFolders) {
                        const correctData = row.structure[folder.key];
                        if (correctData && !newSlots[row.id][folder.key][targetLang]) {
                            // Empty slot found!
                            newSlots[row.id][folder.key][targetLang] = item;
                            foundSlot = true;
                            break;
                        }
                    }
                    if (foundSlot) break;
                }

                if (foundSlot) {
                    setSlots(newSlots);
                    setFeedback(""); // clear any old feedback
                    checkIfAllSlotsFilled(newSlots, targetLang);
                } else {
                    setFeedback("これ以上置けません。");
                }
            };

            const removeCard = (rowId, folderKey, targetLang) => {
                const newSlots = JSON.parse(JSON.stringify(slots));
                newSlots[rowId][folderKey][targetLang] = null;
                setSlots(newSlots);
                setIsPhaseComplete(false);
                setFeedback("");
            };

            const checkIfAllSlotsFilled = (currentSlots, targetLang) => {
                let allFilled = true;
                for (const row of currentQ.rows) {
                    for (const folder of activeFolders) {
                        if (row.structure[folder.key] && !currentSlots[row.id][folder.key][targetLang]) {
                            allFilled = false;
                            break;
                        }
                    }
                }
                setIsPhaseComplete(allFilled);
            };

            const evaluateSort = () => {
                const isJpPhase = phase === 'sort_jp';
                const targetLang = isJpPhase ? 'jp' : 'en';
                let allCorrect = true;

                for (const row of currentQ.rows) {
                    for (const folder of activeFolders) {
                        const correctData = row.structure[folder.key];
                        if (correctData) {
                            const placedCard = slots[row.id][folder.key][targetLang];
                            if (!placedCard || placedCard.text !== correctData[targetLang]) {
                                allCorrect = false;
                                break;
                            }
                        }
                    }
                }

                if (allCorrect) {
                    setFeedback("正解です！");
                    setTimeout(() => {
                        if (isJpPhase) {
                            if (course?.japaneseOnly) {
                                setIsPhaseComplete(false); // reset for English phase
                                nextQuestion();
                            } else {
                                setPhase('sort_en');
                                setIsPhaseComplete(false); // reset for English phase
                                setFeedback("Great! Now Sort English.");
                            }
                        } else {
                            nextQuestion();
                        }
                    }, 1000);
                } else {
                    flow.markWrong();
                    setFeedback("間違いがあります。もう一度考えてみましょう！");
                }
            };

            // --- Composition Phase Logic ---
            const handleInputChange = (rowId, folderKey, val) => {
                setInputs(prev => ({ ...prev, [`${rowId}_${folderKey}`]: val }));
            };

            const checkComposition = () => {
                let isAllCorrect = true;
                currentQ.rows.forEach(row => {
                    activeFolders.forEach(folder => {
                        const correctText = row.structure[folder.key]?.en;
                        if (correctText) {
                            const inputVal = inputs[`${row.id}_${folder.key}`] || "";
                            if (!areEnglishAnswersEquivalent(inputVal, correctText)) {
                                isAllCorrect = false;
                            }
                        }
                    });
                });

                if (isAllCorrect) {
                    setFeedback("Perfect! All Correct.");
                    setCompositionCorrection("");
                    setTimeout(nextQuestion, 1000);
                } else {
                    flow.markWrong();
                    setFeedback("Some parts are wrong. Check again.");
                    const correctSentence = currentQ.rows
                        .map(row => activeFolders
                            .map(folder => row.structure[folder.key]?.en)
                            .filter(Boolean)
                            .join(" "))
                        .filter(Boolean)
                        .join(" / ");
                    setCompositionCorrection(correctSentence ? `正解: ${correctSentence}` : "");
                }
            };




            // Helper
            function isCardUsed(cardId, type) {
                return Object.values(slots).some(row => Object.values(row).some(slot => slot[type]?.id === cardId));
            }

            if (!currentQ) return null;

            return (
                <div className="animate-fade-in w-full p-4">
                    <h3 className="text-xl font-bold mb-4 text-indigo-900 flex items-center gap-2">
                        <Layers className="text-indigo-500" />
                        {mode === 'composition' ? "英作文トレーニング" : "意味順トレーニング"}
                    </h3>

                    {/* Progress & Header */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 text-center sticky top-0 z-10">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <span className="text-xs font-bold text-slate-400">Question {flow.queuePos + 1} / {questions.length}</span>
                            <button onClick={nextQuestion} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">Skip <ArrowRight size={12} /></button>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">{currentQ.original}</h2>

                        {/* Phase Indicator */}
                        <div className="flex justify-center gap-4 text-xs font-bold text-slate-400 mb-4">
                            {mode === 'sort' && (
                                <>
                                    <span className={phase === 'sort_jp' ? 'text-indigo-600' : ''}>1. Sort JP</span>
                                    <span className="text-slate-300">&gt;</span>
                                    <span className={phase === 'sort_en' ? 'text-indigo-600' : ''}>2. Sort EN</span>
                                </>
                            )}
                            {mode === 'composition' && <span className="text-indigo-600">Writing</span>}
                        </div>

                        {phase === 'selection' && (
                            <div className="grid gap-2">
                                {selectionOptions.map((opt, i) => (
                                    <button key={i} onClick={() => handleSelection(opt)} className="block w-full text-left p-4 border-2 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition font-bold text-slate-700">
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="h-6 text-indigo-600 font-bold">{feedback}</div>
                        {mode === 'composition' && compositionCorrection && (
                            <p className="text-sm text-slate-600 mt-1">{compositionCorrection}</p>
                        )}
                    </div>

                    {phase !== 'selection' && (
                        <div className="overflow-x-auto pb-4">
                            {currentQ.rows?.map(row => (
                                <div key={row.id} className="relative mb-8 min-w-[700px]">
                                    <div className="flex gap-2">
                                        {(showInactiveSortBoxes
                                            ? activeFolders
                                            : activeFolders.filter(folder => row.structure?.[folder.key] != null)
                                        ).map(folder => {
                                            const part = row.structure?.[folder.key];
                                            const isActive = part != null;
                                            const folderLabel = row.labels?.[folder.key] || folder.label;
                                            const content = slots[row.id]?.[folder.key] || { jp: null, en: null };
                                            const isJpFilled = content.jp !== null;
                                            const isEnFilled = content.en !== null;

                                            // Input Mode
                                            if (phase === 'composition_input' && isActive) {
                                                const val = inputs[`${row.id}_${folder.key}`] || "";
                                                return (
                                                    <div key={folder.key} className="flex-1 flex flex-col relative">
                                                        <div className={`${folder.color} font-bold text-center py-1 text-xs rounded-t border-b-2 text-white`}>{folderLabel}</div>
                                                        <div className="bg-slate-50 border-2 border-slate-200 h-32 rounded-b p-2 flex flex-col items-center justify-center gap-2">
                                                            <div className="text-sm font-bold text-slate-500 mb-1">{content.jp?.text || part?.jp}</div>
                                                            <input
                                                                type="text"
                                                                className="border border-slate-300 rounded p-2 text-center w-full font-bold text-indigo-800"
                                                                value={val}
                                                                onChange={(e) => handleInputChange(row.id, folder.key, e.target.value)}
                                                                placeholder="En"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // Sort Mode
                                            return (
                                                <div key={folder.key} className="flex-1 flex flex-col relative">
                                                    <div className={`${folder.color} font-bold text-center py-1 text-xs rounded-t border-b-2 ${isActive ? 'opacity-100' : 'opacity-40'}`}>{folderLabel}</div>
                                                    <div
                                                        className={`bg-white border-2 border-dashed h-32 rounded-b p-2 flex flex-col gap-1 items-center justify-center transition-all ${isActive ? 'cursor-pointer hover:bg-slate-50' : 'opacity-50'}`}
                                                        onClick={() => {
                                                            if (isActive && isJpFilled && phase === 'sort_jp') removeCard(row.id, folder.key, 'jp');
                                                            if (isActive && isEnFilled && phase === 'sort_en') removeCard(row.id, folder.key, 'en');
                                                        }}
                                                    >
                                                        {isJpFilled && <div className="bg-white border border-slate-300 px-2 py-1 rounded shadow-sm text-sm font-bold text-slate-700 w-full text-center hover:bg-red-50 hover:border-red-300 transition-colors">{content.jp.text}</div>}

                                                        {isEnFilled ? (
                                                            <div className="bg-indigo-600 text-white px-2 py-1 rounded shadow-sm text-sm font-bold w-full text-center hover:bg-red-500 transition-colors">{content.en.text}</div>
                                                        ) : (
                                                            isActive && phase === 'sort_en' && <div className="text-slate-300 text-xs text-center w-full">Click below to place</div>
                                                        )}
                                                        {(!isJpFilled && isActive && phase === 'sort_jp') && <div className="text-slate-300 text-xs text-center w-full">Click below to place</div>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {phase === 'sort_jp' && (
                        <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 p-4 pb-8 backdrop-blur z-50">
                            <p className="text-white text-center font-bold mb-2">日本語カードを並べてください</p>
                            <div className="flex justify-center gap-2 flex-wrap">
                                {shuffledJpOptions.filter(opt => !isCardUsed(opt.id, 'jp')).map(card => (
                                    <button
                                        key={card.id}
                                        onClick={() => handleCardClick(card, 'jp')}
                                        className={`bg-white px-4 py-3 rounded-xl font-bold border-b-4 border-slate-300 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition`}
                                    >
                                        {card.text}
                                    </button>
                                ))}
                            </div>
                            {isPhaseComplete && (
                                <div className="mt-4 flex justify-center animate-fade-in">
                                    <button onClick={evaluateSort} className="bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-xl hover:bg-green-600 transition w-full max-w-sm">
                                        Check Answer
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {phase === 'sort_en' && (
                        <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 p-4 pb-8 backdrop-blur z-50">
                            <p className="text-white text-center font-bold mb-2">英語カードを並べてください</p>
                            <div className="flex justify-center gap-2 flex-wrap">
                                {shuffledEnOptions.filter(opt => !isCardUsed(opt.id, 'en')).map(card => (
                                    <button
                                        key={card.id}
                                        onClick={() => handleCardClick(card, 'en')}
                                        className={`bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold border-b-4 border-indigo-800 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition`}
                                    >
                                        {card.text}
                                    </button>
                                ))}
                            </div>
                            {isPhaseComplete && (
                                <div className="mt-4 flex justify-center animate-fade-in">
                                    <button onClick={evaluateSort} className="bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-xl hover:bg-green-600 transition w-full max-w-sm">
                                        Check Answer
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {phase === 'composition_input' && (
                        <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-center pb-8 sticky z-50">
                            <button onClick={checkComposition} className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-indigo-700 transition w-full max-w-sm">
                                Check Answer
                            </button>
                        </div>
                    )}
                </div>
            );
        };


        // ========== COMPLETE SCREEN ==========
        const CompleteScreen = ({ onReset }) => (
            <div className="animate-fade-in max-w-2xl mx-auto p-4 text-center">
                <div className="bg-white p-10 rounded-2xl shadow-xl">
                    <div className="text-6xl mb-6">🎉</div>
                    <h2 className="text-3xl font-bold text-indigo-900 mb-4">おめでとう！</h2>
                    <p className="text-slate-600 mb-8">すべてのトレーニングを完了しました！</p>
                    <button onClick={onReset} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg">コース選択に戻る</button>
                </div>
            </div>
        );


        // ========== MAIN APP ==========
        const App = () => {
            const [selectedCourse, setSelectedCourse] = useState(null);
            const [currentStep, setCurrentStep] = useState('select'); // select, videoIntro, flashcard, instant, fillin, writing, error, sort, composition, complete

            useEffect(() => {
                if (typeof window !== "undefined" && window.speechSynthesis) {
                    const synth = window.speechSynthesis;
                    synth.getVoices();

                    // Chrome workaround: unlock speech after first user interaction.
                    const unlockSpeech = () => {
                        try {
                            const u = new SpeechSynthesisUtterance(" ");
                            u.volume = 0;
                            synth.speak(u);
                            synth.cancel();
                        } catch (e) {
                            // Ignore unlock failures.
                        }
                    };

                    window.addEventListener("pointerdown", unlockSpeech, { once: true });
                    return () => window.removeEventListener("pointerdown", unlockSpeech);
                }
            }, []);

            const stepSequence = useMemo(() => {
                if (!selectedCourse) return [];
                if (Array.isArray(selectedCourse.stepOrder) && selectedCourse.stepOrder.length > 0) {
                    return selectedCourse.stepOrder;
                }
                if (selectedCourse.japaneseOnly) {
                    return ['flashcard', 'sort', 'complete'];
                }
                return ['flashcard', 'fillin', 'error', 'sort', 'composition', 'complete'];
            }, [selectedCourse]);

            const handleCourseSelect = (course) => {
                setSelectedCourse(course);
                if (Array.isArray(course.stepOrder) && course.stepOrder.length > 0) {
                    setCurrentStep(course.stepOrder[0]);
                } else {
                    setCurrentStep('flashcard');
                }
            };

            const goToNextStep = () => {
                setCurrentStep(prev => {
                    const idx = stepSequence.indexOf(prev);
                    if (idx === -1) return stepSequence[0] || 'complete';
                    return stepSequence[idx + 1] || 'complete';
                });
            };

            const handleReset = () => { setSelectedCourse(null); setCurrentStep('select'); };

            return (
                <div className="min-h-screen">
                    <AppHeader showHome={currentStep !== 'select'} onHome={handleReset} />
                    <div className="py-8">
                    {currentStep === 'select' && <CourseSelect onSelect={handleCourseSelect} />}

                    {currentStep === 'videoIntro' && selectedCourse && (
                        <VideoIntroStep
                            course={selectedCourse}
                            onComplete={goToNextStep}
                        />
                    )}

                    {currentStep === 'flashcard' && selectedCourse && (
                        <FlashcardStep
                            flashcards={selectedCourse.flashcards}
                            onComplete={goToNextStep}
                        />
                    )}

                    {currentStep === 'instant' && selectedCourse && (
                        <InstantStep
                            questions={selectedCourse.instantQuestions}
                            onComplete={goToNextStep}
                        />
                    )}

                    {currentStep === 'fillin' && selectedCourse && (
                        <FillInStep
                            questions={selectedCourse.questions}
                            fillInQuestions={selectedCourse.fillInQuestions}
                            onComplete={goToNextStep}
                        />
                    )}

                    {currentStep === 'writing' && selectedCourse && (
                        <WritingStep
                            questions={selectedCourse.writingQuestions}
                            onComplete={goToNextStep}
                        />
                    )}

                    {currentStep === 'error' && selectedCourse && (
                        <ErrorStep
                            questions={selectedCourse.errorQuestions || selectedCourse.questions}
                            course={selectedCourse}
                            onComplete={goToNextStep}
                        />
                    )}

                    {currentStep === 'sort' && selectedCourse && (
                        <TrainingStep
                            questions={selectedCourse.questions}
                            mode="sort"
                            onComplete={goToNextStep}
                            course={selectedCourse}
                        />
                    )}

                    {currentStep === 'composition' && selectedCourse && !selectedCourse.japaneseOnly && (
                        <TrainingStep
                            questions={selectedCourse.questions}
                            mode="composition"
                            onComplete={goToNextStep}
                            course={selectedCourse}
                        />
                    )}

                    {currentStep === 'complete' && <CompleteScreen onReset={handleReset} />}
                    </div>
                </div>
            );
        };

        createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
