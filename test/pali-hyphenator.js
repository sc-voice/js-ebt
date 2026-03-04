import { describe, it, expect } from '@sc-voice/vitest';
import { PaliHyphenator } from '../index.js';

describe("pali-hyphenator", function() {
    it("TESTTESTdefault ctor", ()=>{
        var ph = new PaliHyphenator();
        expect(ph.minWord).toBe(5);
        expect(ph.maxWord).toBe(25);
        expect(ph.hyphen).toBe("\u00AD");
        expect(PaliHyphenator.VOWELS).toBe("aāeiīouū");
        expect("xdhammaz".replace(ph.reAtomic,"y")).toBe('xyz');
        expect("xdhammoz".replace(ph.reAtomic,"y")).toBe('xyz');
        expect("xdhammpz".replace(ph.reAtomic,"y")).toBe('xdhammpz');
        expect("xsakuz".replace(ph.reAtomic,"y")).toBe('xyz');

        // common prefix
        expect("xsakulaz".replace(ph.reAtomic,"y")).toBe('xyz');
        expect("xsakusakulaz".replace(ph.reAtomic,"y")).toBe('xyyz');
        expect("xsakulasakulaz".replace(ph.reAtomic,"y")).toBe('xyyz');

        expect(ph.atomic.slice(0, 10)).toEqual([
            "aṅguttara",
            "vibhaṅga",
            "caṇḍala",
            "indriya",
            "nibbāna",
            "thaddha",
            "vitakka",
            "Ānanda",
            "bhacca",
            "bhadde",
        ]);

        // Ending vowel should match any vowel
        var patAtomic = ph.reAtomic.toString();
        var iSank = patAtomic.indexOf('saṅk');
        expect(patAtomic.substring(iSank,iSank+25))
            .toBe('saṅk|sat(a|ā|e|i|ī|o|u|ū)');
    });
    it("custom ctor", ()=>{
        var atomic = [];
        var minWord = 2;
        var maxWord = 20;
        var hyphen = '-';
        var ph = new PaliHyphenator({
            atomic,
            minWord,
            maxWord,
            hyphen,
        });
        expect(ph.atomic).toBe(atomic);
        expect(ph).properties({
            atomic,
            minWord,
            maxWord,
            hyphen,
        });
    });
    it("hyphenate(word) => handles dhamma", ()=>{
        var hyphen = "-";
        var ph = new PaliHyphenator({
            minWord:1,
            maxWord:3,
            hyphen,
        });
        expect(ph.hyphenate("dhamma").split(hyphen)).toEqual([
            `dhamma`,
        ]);

        expect(ph.hyphenate("dhammadhamma").split(hyphen)).toEqual([
            `dhamma`,
            `dhamma`,
        ]);
    });
    it("TESTTESThyphenate(word) => handles MN142", ()=>{
        var word = [
            "abhivādanapaccuṭṭhānaañjalikammasāmīci",
            "kammacīvarapiṇḍapātasenāsanagilānappa",
            "ccayabhesajjaparikkhārānuppadānena",
        ].join('');
        var maxWord = 20;
        var hyphen = "-";
        var ph = new PaliHyphenator({
            maxWord,
            hyphen,
        });
        var hyphenated = ph.hyphenate(word).split(hyphen);
        var i = 0;
        expect(hyphenated[i++].length).toBeLessThan(maxWord+1);
        expect(hyphenated[i++].length).toBeLessThan(maxWord+1);
        expect(hyphenated[i++].length).toBeLessThan(maxWord+1);
        expect(hyphenated[i++].length).toBeLessThan(maxWord+1);
        expect(hyphenated[i++].length).toBeLessThan(maxWord+1);
        expect(hyphenated[i++].length).toBeLessThan(maxWord+1);
        expect(hyphenated[i++].length).toBeLessThan(maxWord+1);
        expect(hyphenated[i++].length).toBeLessThan(maxWord+1);
        expect(hyphenated).toEqual([
            `abhivā`,
            `danapac`, // doubled consonant
            `cuṭṭhā`,
            `naañjali`,
            `kamma`, // atomic
            `sāmīci`,
            `kamma`,
            `cīvara`,
            `piṇḍa`, // atomic
            `pātasenā`,
            `sanagilā`,
            `nappacca`,
            `yabhesajja`,
            `parik`,
            `khārānup`,
            `padā`,
            `nena`,
        ]);
    });
    it("TESTTESThyphenate(word) => handles kamma", ()=>{
        var ph = new PaliHyphenator({
            maxWord: 10,
        });
        var word = "kammakammakameleon";
        var hyphen = "\u00ad";
        expect(ph.hyphenate(word).split(hyphen)).toEqual([
            "kamma",
            "kamma",
            "kameleon",
        ]);
    });
    it("TESTTESThyphenate(word) => handles ekaṁ", ()=>{
        var hyphen = "\u00ad";
        var ph = new PaliHyphenator({
            maxWord: 5,
            minWord: 2,
            hyphen,
            verbose: "",
        });

        // should not break
        expect("ekaṁ".length).toBe(4);
        expect(ph.hyphenate("ekaṁ").split(hyphen)).toEqual([
            "ekaṁ", ]);

        // should break
        expect(ph.hyphenate("ekamantaṁ").split(hyphen)).toEqual([
            "eka", "man", "taṁ", ]);
        expect(ph.hyphenate("ekamanso").split(hyphen)).toEqual([
            "eka", "manso", ]);
        expect(ph.hyphenate("Ekamidāhaṁ").split(hyphen)).toEqual([
            "Ekami", "dāhaṁ", ]);
        expect(ph.hyphenate("ekacce").split(hyphen)).toEqual([
            "ekac", "ce", ]);
    });
    it("TESTTESThyphenate(word) => handles pari", ()=>{
        var hyphen = "\u00ad";
        var ph = new PaliHyphenator({
            maxWord: 5,
            minWord: 2,
            hyphen,
            verbose: "",
        });

        // should not break
        expect("pari".length).toBe(4);
        expect(ph.hyphenate("pari").split(hyphen)).toEqual([
            "pari", ]);

        // should break
        expect(ph.hyphenate("parikkhārā").split(hyphen)).toEqual([
            "parik", "khārā", ]);
    });
    it("TESTTESThyphenate(word) => handles long words", ()=>{
        var hyphen = "\u00ad";
        var ph = new PaliHyphenator({
            hyphen,
            verbose: "",
        });

        // should not break
        var word = "cīvarapiṇḍapātasenāsanagilānap"+
            "paccayabhesajjaparikkhārena";
        expect(ph.hyphenate(word).split(hyphen)).toEqual([
            'cīvara',
            'piṇḍa',
            'pātasenā',
            'sanagilā',
            'nappacca',
            'yabhesajja',
            'parik',
            'khārena'
        ]);
    });
});
