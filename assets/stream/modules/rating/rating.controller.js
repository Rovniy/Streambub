(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('ratingController', ratingController);

    ratingController.$inject = [];

    function ratingController() {
        var vm = this;
        vm.hs = {
            main : [
                {
                    place: 1,
                    name: 'Happasc2',
                    link: 'https://www.twitch.tv/happasc2',
                    rating: 4.3,
                    stars: 4,
                    count: 179
                },
                {
                    place: 2,
                    name: 'only_smiles',
                    link: 'https://www.twitch.tv/only_smiles',
                    rating: 4.1,
                    stars: 4,
                    count: 10
                },
                {
                    place: 3,
                    name: 'SilverName',
                    link: 'https://www.twitch.tv/silvername',
                    rating: 4.1,
                    stars: 4,
                    count: 270
                },
                {
                    place: 4,
                    name: 'Sinedd92',
                    link: 'https://www.twitch.tv/sinedd92',
                    rating: 4.0,
                    stars: 4,
                    count: 30
                },
                {
                    place: 5,
                    name: 'Serg_HeavyBeard',
                    link: 'https://www.twitch.tv/serg_heavybeard',
                    rating: 4.0,
                    stars: 4,
                    count: 43
                },
                {
                    place: 6,
                    name: 'pashadizel',
                    link: 'https://www.twitch.tv/pashadizel',
                    rating: 4.0,
                    stars: 4,
                    count: 27
                },
                {
                    place: 7,
                    name: 'NickChipperHS',
                    link: 'https://www.twitch.tv/nickchipperhs',
                    rating: 4.0,
                    stars: 4,
                    count: 73
                },
                {
                    place: 8,
                    name: 'shtan_udachi',
                    link: 'https://www.twitch.tv/shtan_udachi',
                    rating: 4.0,
                    stars: 4,
                    count: 70
                },
                {
                    place: 9,
                    name: 'gnumme',
                    link: 'https://www.twitch.tv/gnumme',
                    rating: 3.9,
                    stars: 4,
                    count: 364
                },
                {
                    place: 10,
                    name: 'Allad88',
                    link: 'https://www.twitch.tv/allad88',
                    rating: 3.9,
                    stars: 4,
                    count: 25
                }
            ],
            interactive: [
                {
                    place: 1,
                    name: 'Sinedd92',
                    link: 'https://www.twitch.tv/sinedd92',
                    rating: 4.5,
                    count: 30
                },
                {
                    place: 2,
                    name: 'Happasc2',
                    link: 'https://www.twitch.tv/happasc2',
                    rating: 4.4,
                    count: 179
                },
                {
                    place: 3,
                    name: 'only_smiles',
                    link: 'https://www.twitch.tv/only_smiles',
                    rating: 4.4,
                    count: 10
                },
                {
                    place: 4,
                    name: 'Serg_HeavyBeard',
                    link: 'https://www.twitch.tv/serg_heavybeard',
                    rating: 4.3,
                    count: 43
                },
                {
                    place: 5,
                    name: 'HITMANRF',
                    link: 'https://www.twitch.tv/hitmanrf',
                    rating: 4.0,
                    count: 12
                }
            ],
            skill: [
                {
                    place: 1,
                    name: 'shtan_udachi',
                    link: 'https://www.twitch.tv/shtan_udachi',
                    rating: 4.8,
                    count: 70
                },
                {
                    place: 2,
                    name: 'gnumme',
                    link: 'https://www.twitch.tv/gnumme',
                    rating: 4.7,
                    count: 364
                },
                {
                    place: 3,
                    name: 'SilverName',
                    link: 'https://www.twitch.tv/silvername',
                    rating: 4.7,
                    count: 270
                },
                {
                    place: 4,
                    name: 'Allad88',
                    link: 'https://www.twitch.tv/allad88',
                    rating: 4.6,
                    count: 25
                },
                {
                    place: 5,
                    name: 'NickChipperHS',
                    link: 'https://www.twitch.tv/nickchipperhs',
                    rating: 4.5,
                    count: 73
                }
            ],
            harizm: [
                {
                    place: 1,
                    name: 'Happasc2',
                    link: 'https://www.twitch.tv/happasc2',
                    rating: 4.6,
                    count: 179
                },
                {
                    place: 2,
                    name: 'only_smiles',
                    link: 'https://www.twitch.tv/only_smiles',
                    rating: 4.3,
                    count: 10
                },
                {
                    place: 3,
                    name: 'SilverName',
                    link: 'https://www.twitch.tv/silvername',
                    rating: 4.3,
                    count: 270
                },
                {
                    place: 4,
                    name: 'EvilArthas',
                    link: 'https://www.twitch.tv/evilarthas',
                    rating: 4.2,
                    count: 290
                },
                {
                    place: 5,
                    name: 'pashadizel',
                    link: 'https://www.twitch.tv/pashadizel',
                    rating: 4.1,
                    count: 27
                }
            ]
        };
        vm.csgo = {
            main : [
                {
                    place: 1,
                    name: 'Ceh9',
                    link: 'https://www.twitch.tv/ceh9',
                    rating: 4.4,
                    stars: 4,
                    count: 426
                },
                {
                    place: 2,
                    name: 'creative7play',
                    link: 'https://www.twitch.tv/creative7play',
                    rating: 4.1,
                    stars: 4,
                    count: 283
                },
                {
                    place: 3,
                    name: 'bonnieivse',
                    link: 'https://www.twitch.tv/bonnieivse',
                    rating: 3.9,
                    stars: 4,
                    count: 6
                },
                {
                    place: 4,
                    name: 'adamsonshow',
                    link: 'https://www.twitch.tv/adamsonshow',
                    rating: 3.9,
                    stars: 4,
                    count: 201
                },
                {
                    place: 5,
                    name: 'cheatbanned',
                    link: 'https://www.twitch.tv/cheatbanned',
                    rating: 3.7,
                    stars: 4,
                    count: 380
                },
                {
                    place: 6,
                    name: 'bloody_elf',
                    link: 'https://www.twitch.tv/bloody_elf',
                    rating: 3.7,
                    stars: 4,
                    count: 23
                },
                {
                    place: 7,
                    name: 'Zeus',
                    link: 'https://www.twitch.tv/zeus',
                    rating: 3.4,
                    stars: 3,
                    count: 433
                },
                {
                    place: 8,
                    name: 'seized',
                    link: 'https://www.twitch.tv/seizedwf',
                    rating: 3.4,
                    stars: 3,
                    count: 175
                },
                {
                    place: 9,
                    name: 'hoochR',
                    link: 'https://www.twitch.tv/hoochrrr',
                    rating: 3.2,
                    stars: 3,
                    count: 50
                },
                {
                    place: 10,
                    name: 'flamie',
                    link: 'https://www.twitch.tv/flamieff',
                    rating: 2.8,
                    stars: 3,
                    count: 167
                }
            ],
            interactive: [
                {
                    place: 1,
                    name: 'Ceh9',
                    link: 'https://www.twitch.tv/ceh9',
                    rating: 4.7,
                    count: 426
                },
                {
                    place: 2,
                    name: 'creative7play',
                    link: 'https://www.twitch.tv/creative7play',
                    rating: 4.1,
                    count: 283
                },
                {
                    place: 3,
                    name: 'bonnieivse',
                    link: 'https://www.twitch.tv/bonnieivse',
                    rating: 4.1,
                    count: 6
                },
                {
                    place: 4,
                    name: 'bloody_elf',
                    link: 'https://www.twitch.tv/bloody_elf',
                    rating: 3.8,
                    count: 23
                },
                {
                    place: 5,
                    name: 'cheatbanned',
                    link: 'https://www.twitch.tv/cheatbanned',
                    rating: 3.7,
                    count: 380
                }
            ],
            skill: [
                {
                    place: 1,
                    name: 'flamie',
                    link: 'https://www.twitch.tv/flamieff',
                    rating: 4.5,
                    count: 167
                },
                {
                    place: 2,
                    name: 'seized',
                    link: 'https://www.twitch.tv/seizedwf',
                    rating: 4.5,
                    count: 175
                },
                {
                    place: 3,
                    name: 'Zeus',
                    link: 'https://www.twitch.tv/zeus',
                    rating: 4.4,
                    count: 433
                },
                {
                    place: 4,
                    name: 'cheatbanned',
                    link: 'https://www.twitch.tv/cheatbanned',
                    rating: 4.3,
                    count: 380
                },
                {
                    place: 5,
                    name: 'hoochR',
                    link: 'https://www.twitch.tv/hoochrrr',
                    rating: 4.1,
                    count: 50
                }
            ],
            harizm: [
                {
                    place: 1,
                    name: 'Ceh9',
                    link: 'https://www.twitch.tv/ceh9',
                    rating: 4.8,
                    count: 426
                },
                {
                    place: 2,
                    name: 'adamsonshow',
                    link: 'https://www.twitch.tv/adamsonshow',
                    rating: 4.8,
                    count: 201
                },
                {
                    place: 3,
                    name: 'creative7play',
                    link: 'https://www.twitch.tv/creative7play',
                    rating: 4.6,
                    count: 283
                },
                {
                    place: 4,
                    name: 'bonnieivse',
                    link: 'https://www.twitch.tv/bonnieivse',
                    rating: 4.1,
                    count: 6
                },
                {
                    place: 5,
                    name: 'seized',
                    link: 'https://www.twitch.tv/seizedwf',
                    rating: 3.7,
                    count: 175
                }
            ]
        };
        vm.dota2 = {
            main : [
                {
                    place: 1,
                    name: 'DreadzTV',
                    link: 'https://www.twitch.tv/dreadztv',
                    rating: 4.4,
                    stars: 4,
                    count: 184
                },
                {
                    place: 2,
                    name: 'Dendi',
                    link: 'https://www.twitch.tv/dendi',
                    rating: 4.3,
                    stars: 4,
                    count: 156
                },
                {
                    place: 3,
                    name: 'Na_podhvate',
                    link: 'https://www.twitch.tv/na_podhvate',
                    rating: 4.3,
                    stars: 4,
                    count: 59
                },
                {
                    place: 4,
                    name: 'rxnexus',
                    link: 'https://www.twitch.tv/rxnexus',
                    rating: 4.3,
                    stars: 4,
                    count: 68
                },
                {
                    place: 5,
                    name: 'ALOHADANCETV',
                    link: 'https://www.twitch.tv/alohadancetv',
                    rating: 4.3,
                    stars: 4,
                    count: 44
                },
                {
                    place: 6,
                    name: 'A1taOda',
                    link: 'https://www.twitch.tv/a1taoda',
                    rating: 4.3,
                    stars: 4,
                    count: 47
                },
                {
                    place: 7,
                    name: 'XaKoH',
                    link: 'https://www.twitch.tv/xakoh',
                    rating: 4.2,
                    stars: 4,
                    count: 20
                },
                {
                    place: 8,
                    name: 'followKudes',
                    link: 'https://www.twitch.tv/followkudes',
                    rating: 4.1,
                    stars: 4,
                    count: 42
                },
                {
                    place: 9,
                    name: 'ybicanoooobov',
                    link: 'https://www.twitch.tv/ybicanoooobov',
                    rating: 4.0,
                    stars: 4,
                    count: 43
                },
                {
                    place: 10,
                    name: 'CarTmaNzbs',
                    link: 'https://www.twitch.tv/cartmanzbs',
                    rating: 4.0,
                    stars: 4.0,
                    count: 71
                }
            ],
            interactive: [
                {
                    place: 1,
                    name: 'VeRsuta',
                    link: 'https://www.twitch.tv/versuta',
                    rating: 4.5,
                    count: 42
                },
                {
                    place: 2,
                    name: 'Na_podhvate',
                    link: 'https://www.twitch.tv/na_podhvate',
                    rating: 4.5,
                    count: 59
                },
                {
                    place: 3,
                    name: 'CarTmaNzbs',
                    link: 'https://www.twitch.tv/cartmanzbs',
                    rating: 4.3,
                    count: 71
                },
                {
                    place: 4,
                    name: 'A1taOda',
                    link: 'https://www.twitch.tv/a1taoda',
                    rating: 4.3,
                    count: 47
                },
                {
                    place: 5,
                    name: 'DreadzTV',
                    link: 'https://www.twitch.tv/dreadztv',
                    rating: 4.0,
                    count: 184
                }
            ],
            skill: [
                {
                    place: 1,
                    name: 'ALOHADANCETV',
                    link: 'https://www.twitch.tv/alohadancetv',
                    rating: 4.6,
                    count: 44
                },
                {
                    place: 2,
                    name: 'Dendi',
                    link: 'https://www.twitch.tv/dendi',
                    rating: 4.5,
                    count: 156
                },
                {
                    place: 3,
                    name: 'rxnexus',
                    link: 'https://www.twitch.tv/rxnexus',
                    rating: 4.5,
                    count: 68
                },
                {
                    place: 4,
                    name: 'DreadzTV',
                    link: 'https://www.twitch.tv/dreadztv',
                    rating: 4.4,
                    count: 184
                },
                {
                    place: 5,
                    name: 'A1taOda',
                    link: 'https://www.twitch.tv/a1taoda',
                    rating: 4.3,
                    count: 47
                }
            ],
            harizm: [
                {
                    place: 1,
                    name: 'DreadzTV',
                    link: 'https://www.twitch.tv/dreadztv',
                    rating: 4.8,
                    count: 184
                },
                {
                    place: 2,
                    name: 'Dendi',
                    link: 'https://www.twitch.tv/dendi',
                    rating: 4.5,
                    count: 156
                },
                {
                    place: 3,
                    name: 'Na_podhvate',
                    link: 'https://www.twitch.tv/na_podhvate',
                    rating: 4.5,
                    count: 59
                },
                {
                    place: 4,
                    name: 'A1taOda',
                    link: 'https://www.twitch.tv/a1taoda',
                    rating: 4.4,
                    count: 47
                },
                {
                    place: 5,
                    name: 'ybicanoooobov',
                    link: 'https://www.twitch.tv/ybicanoooobov',
                    rating: 4.3,
                    count: 43
                }
            ]
        };
        vm.wot = {
            main : [
                {
                    place: 1,
                    name: 'Rizhaya',
                    link: 'https://www.twitch.tv/rizhaya',
                    rating: 4.7,
                    stars: 5,
                    count: 13
                },
                {
                    place: 2,
                    name: 'AkTeP__wot ',
                    link: 'https://www.twitch.tv/aktep__wot',
                    rating: 4.7,
                    stars: 5,
                    count: 218
                },
                {
                    place: 3,
                    name: 'StraikoiD',
                    link: 'https://www.twitch.tv/straikoid',
                    rating: 4.7,
                    stars: 5,
                    count: 63
                },
                {
                    place: 4,
                    name: 'Angelina031',
                    link: 'https://www.twitch.tv/angelina031',
                    rating: 4.6,
                    stars: 5,
                    count: 21
                },
                {
                    place: 5,
                    name: 'KorbenDetka',
                    link: 'https://www.twitch.tv/korbendetka',
                    rating: 4.6,
                    stars: 5,
                    count: 76
                },
                {
                    place: 6,
                    name: 'Aces_TV',
                    link: 'https://www.twitch.tv/aces_tv',
                    rating: 4.5,
                    stars: 4,
                    count: 330
                },
                {
                    place: 7,
                    name: 'Villageidiot',
                    link: 'https://www.twitch.tv/viilageidiot',
                    rating: 4.5,
                    stars: 4,
                    count: 26
                },
                {
                    place: 8,
                    name: 'PROTanki_Yusha ',
                    link: 'https://www.twitch.tv/protanki_yusha',
                    rating: 4.3,
                    stars: 4,
                    count: 139
                },
                {
                    place: 9,
                    name: 'WePlayWoT',
                    link: 'https://www.twitch.tv/weplaywot',
                    rating: 4.2,
                    stars: 4,
                    count: 110
                },
                {
                    place: 10,
                    name: 'Armor_TV',
                    link: 'https://www.twitch.tv/armor_tv',
                    rating: 4.1,
                    stars: 4,
                    count: 35
                }
            ],
            interactive: [
                {
                    place: 1,
                    name: 'Rizhaya',
                    link: 'https://www.twitch.tv/rizhaya',
                    rating: 5,
                    count: 13
                },
                {
                    place: 2,
                    name: 'Angelina031',
                    link: 'https://www.twitch.tv/angelina031',
                    rating: 4.8,
                    count: 21
                },
                {
                    place: 3,
                    name: 'AkTeP__wot ',
                    link: 'https://www.twitch.tv/aktep__wot',
                    rating: 4.8,
                    count: 218
                },
                {
                    place: 4,
                    name: 'Aces_TV',
                    link: 'https://www.twitch.tv/aces_tv',
                    rating: 4.7,
                    count: 330
                },
                {
                    place: 5,
                    name: 'StraikoiD',
                    link: 'https://www.twitch.tv/straikoid',
                    rating: 4.4,
                    count: 63
                }
            ],
            skill: [
                {
                    place: 1,
                    name: 'StraikoiD',
                    link: 'https://www.twitch.tv/straikoid',
                    rating: 4.8,
                    count: 63
                },
                {
                    place: 2,
                    name: 'KorbenDetka',
                    link: 'https://www.twitch.tv/korbendetka',
                    rating: 4.8,
                    count: 76
                },
                {
                    place: 3,
                    name: 'Aces_TV',
                    link: 'https://www.twitch.tv/aces_tv',
                    rating: 4.7,
                    count: 330
                },
                {
                    place: 4,
                    name: 'Villageidiot',
                    link: 'https://www.twitch.tv/viilageidiot',
                    rating: 4.6,
                    count: 26
                },
                {
                    place: 5,
                    name: 'AkTeP__wot ',
                    link: 'https://www.twitch.tv/aktep__wot',
                    rating: 4.5,
                    count: 218
                }
            ],
            harizm: [
                {
                    place: 1,
                    name: 'Rizhaya',
                    link: 'https://www.twitch.tv/rizhaya',
                    rating: 5,
                    count: 13
                },
                {
                    place: 2,
                    name: 'Angelina031',
                    link: 'https://www.twitch.tv/angelina031',
                    rating: 4.9,
                    count: 21
                },
                {
                    place: 3,
                    name: 'Villageidiot',
                    link: 'https://www.twitch.tv/viilageidiot',
                    rating: 4.8,
                    count: 26
                },
                {
                    place: 4,
                    name: 'AkTeP__wot ',
                    link: 'https://www.twitch.tv/aktep__wot',
                    rating: 4.7,
                    count: 218
                },
                {
                    place: 5,
                    name: 'StraikoiD',
                    link: 'https://www.twitch.tv/straikoid',
                    rating: 4.7,
                    count: 63
                }
            ]
        };

        vm.orderMainData = 'place';
        vm.sortMainReverce = false;

        vm.orderIntarictiveData = 'place';
        vm.sortIntarictiveReverce = false;

        vm.orderSkillData = 'place';
        vm.sortSkillReverce = false;

        vm.orderHarizmData = 'place';
        vm.sortHarizmReverce = false;

        activate();

        ////////////////

        function activate() {
            console.log('/rating');
            ga('send', 'pageview', '/rating');
        }

    }
})();