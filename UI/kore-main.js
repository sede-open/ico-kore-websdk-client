(function($){

    $(document).ready(function () {
        function assertion(options, callback) {
            $.ajax({
                url: options.JWTUrl,
                type: 'get',
                data: options.botInfo,
                dataType: 'json',
                success: function (data) {
                    options.assertion = data.jwt;
                    options.handleError = koreBot.showError;
                    options.chatHistory = koreBot.chatHistory;
                    options.botDetails = koreBot.botDetails;
                    callback(null, options);
                    setTimeout(function () {
                        if (koreBot && koreBot.initToken) {
                            koreBot.initToken(options);
                        }
                    }, 2000);
                },
                error: function (err) {
                    koreBot.showError(err.responseText);
                }
            });
        }
        function getBrandingInformation(options) {
            if (chatConfig.botOptions && chatConfig.botOptions.enableThemes) {
                var brandingAPIUrl = (chatConfig.botOptions.brandingAPIUrl || '').replace(':appId', chatConfig.botOptions.botInfo._id);
                $.ajax({
                    url: brandingAPIUrl,
                    headers: {
                        'Authorization': "bearer " + options.authorization.accessToken,
                    },
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        if(koreBot && koreBot.applySDKBranding) {
                            koreBot.applySDKBranding(data);
                        }
                        if (koreBot && koreBot.initToken) {
                            koreBot.initToken(options);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }

        }
        function onJWTGrantSuccess(options){
            getBrandingInformation(options);
        }

        async function getBotInfo(options) {
            await $.ajax({
                url: options.botInfoUrl,
                type: 'get',
                data: { url: options.userUrl },
                dataType: 'json',
                success: function (data) {
                    options.botInfo = data;
                    // TODO: Move the bot_title override to the server side
                    options.botInfo.customData.bot_title = options.override_bot_title || data.customData.bot_title;
                    options.brandingAPIUrl = options.koreAPIUrl + 'websdkthemes/' + options.botInfo._id + '/activetheme';
                },
                error: function (err) {
                    console.log(err);
                }
            });
            return options.botInfo;
        }

        // Wrap the dependent code in an async function
        async function initializeChat() {
            // Await the completion of getBotInfo before proceeding
            chatConfig.botOptions.botInfo = await getBotInfo(chatConfig.botOptions);
            chatConfig.botOptions.assertionFn = assertion;
            chatConfig.botOptions.jwtgrantSuccessCB = onJWTGrantSuccess;
            koreBot = koreBotChat(); // koreBot variable initialized before the function is called
            koreBot.show(chatConfig);
            $('.openChatWindow').click(function () {
                koreBot.show(chatConfig);
            });
        }

        var chatConfig = window.KoreSDK.chatConfig;
        var koreBot;
        // Call the async function to initialize the chat. This helps ensure getBotInfo is completed before initializing bot
        initializeChat().catch(console.error); // Handle any errors that might occur during initialization
    });

})(jQuery || (window.KoreSDK && window.KoreSDK.dependencies && window.KoreSDK.dependencies.jQuery));