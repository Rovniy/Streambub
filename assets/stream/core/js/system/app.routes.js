(function () {
    'use strict';

    angular
        .module('streampub')
        .config(config);

    config.$inject = ['$routeProvider'];

    /* @ngInject */
    function config ($routeProvider) {
        $routeProvider
            .when ('/', {
                templateUrl: '/index/main.html',
                controller: 'indexController',
                controllerAs: 'vm'
            })
            .when ('/wizard', {
                templateUrl: '/wizard/wizard.html',
                controller: 'wizardController',
                controllerAs: 'vm'
            })
            .when ('/raffle-rules', {
                templateUrl: '/rules/rules.html'
            })
            .when ('/privacy-policy', {
                templateUrl: '/privacypolicy/privacypolicy.html'
            })
            .when ('/test', {
                templateUrl: '/test/test.html',
                controller: 'testController',
                controllerAs: 'vm'
            })
            .when ('/advertisers', {
                templateUrl: '/promo/advertisers/advertisers.html',
                controller: 'promoAdvertisersController',
                controllerAs: 'vm'
            })
            .when ('/cpameshes/ut', {
                templateUrl: '/cpameshes/uniontraff/uniontraff.html',
                controller: 'cpaMeshesUniontraffController',
                controllerAs: 'vm'
            })
            .when ('/cpameshes/vb', {
                templateUrl: '/cpameshes/viboom/viboom.html',
                controller: 'cpaMeshesViboomController',
                controllerAs: 'vm'
            })
            .when ('/cpameshes/bs', {
                templateUrl: '/cpameshes/booseed/booseed.html',
                controller: 'cpaMeshesBooseedController',
                controllerAs: 'vm'
            })
            .when ('/cpameshes/vs', {
                templateUrl: '/cpameshes/videoseed/videoseed.html',
                controller: 'cpaMeshesVideoseedController',
                controllerAs: 'vm'
            })
            .when ('/cpameshes/nr', {
                templateUrl: '/cpameshes/nativeroll/nativeroll.html',
                controller: 'cpaMeshesNativerollController',
                controllerAs: 'vm'
            })
            .when ('/cpameshes/mv', {
                templateUrl: '/cpameshes/moevideo/moevideo.html',
                controller: 'cpaMeshesMoevideoController',
                controllerAs: 'vm'
            })
            .when ('/terms-of-use', {
                templateUrl: '/termsofuse/termsofuse.html'
            })
            .when ('/dashboard', {
                templateUrl: '/dashboard/dashboard.html',
                controller: 'dashboardController',
                controllerAs: 'vm'
            })
            .when ('/news', {
                templateUrl: '/news/newslist/newsList.html',
                controller: 'newsListController',
                controllerAs: 'vm'
            })
            .when ('/global-luck', {
                templateUrl: '/globalluck/globalluck.html',
                controller: 'globalLuckController',
                controllerAs: 'vm'
            })
            .when ('/news/:rubric', {
                templateUrl: '/news/newslistcategory/newsListCategory.html',
                controller: 'newsListCategoryController',
                controllerAs: 'vm'
            })
            .when ('/news/:rubric/:id', {
                templateUrl: '/news/newspage/newsPage.html',
                controller: 'newsPageController',
                controllerAs: 'vm'
            })
            .when ('/wgfest', {
                templateUrl: '/promo/wgfest/wgfest.html',
                controller: 'wgfestController',
                controllerAs: 'vm'
            })
            .when ('/streamer', {
                templateUrl: '/promo/streamer/streamer.html',
                controller: 'streamerPromoController',
                controllerAs: 'vm'
            })
            .when ('/adv', {
                templateUrl: '/adv/adv.html',
                controller: 'advController',
                controllerAs: 'vm'
            })
            .when ('/faq/howto', {
                templateUrl: '/faq/howto/howto.html',
                controller: 'faqHowToController',
                controllerAs: 'vm'
            })
            .when ('/faq/partner', {
                templateUrl: '/faq/partner/partner.html',
                controller: 'faqPartnerController',
                controllerAs: 'vm'
            })
            .when ('/creator/:creatorId', {
                templateUrl: '/creators/creators.html',
                controller: 'creatorsController',
                controllerAs: 'vm'
            })
            .when ('/rating', {
                templateUrl: '/rating/rating.html',
                controller: 'ratingController',
                controllerAs: 'vm'
            })
            .when ('/createraffle', {
                templateUrl: '/createraffle/createraffle.html',
                controller: 'createRaffleController',
                controllerAs: 'vm'
            })
            .when ('/:gaid', {
                templateUrl: '/raffle/raffle.html',
                controller: 'raffleController',
                controllerAs: 'vm'
            })
            .when ('/widget/obsoverlay/:userName', {
                templateUrl: '/widgets/obs/overlayinfo/overlayinfo.html',
                controller: 'overlayInfoController',
                controllerAs: 'vm'
            })
            .when ('/video/:raffleId/:userId/:videoId', {
                templateUrl: '/widgets/showvideo/showVideo.html',
                controller: 'showVideoController',
                controllerAs: 'vm'
            })
            /************************************************* ADMIN **************************************************/
            .when ('/admin/ads/companylist', {
                templateUrl: '/admin/ads/companylist/companyList.html',
                controller: 'adminAdsCompanyList',
                controllerAs: 'vm'
            })
            .when ('/admin/ads/createcompany', {
                templateUrl: '/admin/ads/createcompany/createCompany.html',
                controller: 'adminAdsCreateCompany',
                controllerAs: 'vm'
            })
            .when ('/admin/ads/creategift', {
                templateUrl: '/admin/ads/creategift/createGift.html',
                controller: 'adminAdsCreateGift',
                controllerAs: 'vm'
            })
            .when ('/admin/tags', {
                templateUrl: '/admin/tags/tags.html',
                controller: 'adminTagsController',
                controllerAs: 'vm'
            })
            .when ('/admin/games', {
                templateUrl: '/admin/games/gamesList.html',
                controller: 'adminGamesAdd',
                controllerAs: 'vm'
            })
            .when ('/admin/projects/vikings', {
                templateUrl: '/admin/projects/vikings/vikings.html',
                controller: 'projectVikingsController',
                controllerAs: 'vm'
            })
            .when ('/admin/raffles/createraffle', {
                templateUrl: '/admin/raffles/createraffle/createRaffle.html',
                controller: 'adminRafflesCreateRaffle',
                controllerAs: 'vm'
            })
            .when ('/admin/raffle/update', {
                templateUrl: '/admin/raffles/raffleupdate/raffleupdate.html',
                controller: 'adminRaffleUpdate',
                controllerAs: 'vm'
            })
            .when ('/admin/raffles/raffleslist', {
                templateUrl: '/admin/raffles/raffleslist/rafflesList.html',
                controller: 'adminRafflesRafflesList',
                controllerAs: 'vm'
            })
            .when ('/admin/streamers/add', {
                templateUrl: '/admin/streamers/addstreamer/addStreamer.html',
                controller: 'adminAddStreamer',
                controllerAs: 'vm'
            })
            .when ('/admin/streamers/list', {
                templateUrl: '/admin/streamers/streamerslist/streamersList.html',
                controller: 'adminStreamersStreamersList',
                controllerAs: 'vm'
            })
            .when ('/admin/tracking/list', {
                templateUrl: '/admin/streamers/trackinglist/trackingList.html',
                controller: 'adminTrackingStreamersList',
                controllerAs: 'vm'
            })
            .when ('/admin/tracking/add', {
                templateUrl: '/admin/streamers/addtracking/addTracking.html',
                controller: 'adminAddTracking',
                controllerAs: 'vm'
            })
            .when ('/admin/users/list', {
                templateUrl: '/admin/users/userslist/usersList.html',
                controller: 'adminUsersList',
                controllerAs: 'vm'
            })
            .when ('/admin/creators/list', {
                templateUrl: '/admin/streamers/creatorslist/creatorsList.html',
                controller: 'adminStreamersCreatorsList',
                controllerAs: 'vm'
            })
            .when ('/admin/streamers/:streamerId', {
                templateUrl: '/admin/streamers/streamerinfo/streamersInfo.html',
                controller: 'adminStreamersStreamerInfo',
                controllerAs: 'vm'
            })
            .when ('/admin/news/list', {
                templateUrl: '/admin/news/newslist/newslist.html',
                controller: 'adminNewsList',
                controllerAs: 'vm'
            })
            .when ('/admin/news/create', {
                templateUrl: '/admin/news/createnews/createnews.html',
                controller: 'adminCreateNews',
                controllerAs: 'vm'
            })
            .when ('/admin/news/update', {
                templateUrl: '/admin/news/updatenews/updatenews.html',
                controller: 'adminUpdateNews',
                controllerAs: 'vm'
            })
            .when ('/admin/gifts/list', {
                templateUrl: '/admin/gifts/giftslist/giftsList.html',
                controller: 'adminGiftsList',
                controllerAs: 'vm'
            })
            .when ('/admin/gifts/add', {
                templateUrl: '/admin/gifts/giftsadd/giftsAdd.html',
                controller: 'adminGiftsAdd',
                controllerAs: 'vm'
            })
            .when ('/admin/sponsors/list', {
                templateUrl: '/admin/sponsors/sponsorslist/sponsorsList.html',
                controller: 'adminSponsorsList',
                controllerAs: 'vm'
            })
            .when ('/admin/sponsors/add', {
                templateUrl: '/admin/sponsors/sponsorsadd/sponsorsAdd.html',
                controller: 'adminSponsorsAdd',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

})();