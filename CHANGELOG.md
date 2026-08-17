## [1.14.8](https://github.com/kk-11/capitillian/compare/v1.14.7...v1.14.8) (2026-08-17)


### Bug Fixes

* **sentry:** disable session replay to stop consuming replay quota ([71afa4a](https://github.com/kk-11/capitillian/commit/71afa4a66bda510ef49a6ecb79ad92c502f6b153))

## [1.14.7](https://github.com/kk-11/capitillian/compare/v1.14.6...v1.14.7) (2026-08-17)


### Bug Fixes

* **sentry:** only capture session replay on error, not every session ([4804fc4](https://github.com/kk-11/capitillian/commit/4804fc461fd526867bc41c55c87b083d4c42d250))

## [1.14.6](https://github.com/kk-11/capitillian/compare/v1.14.5...v1.14.6) (2026-08-11)


### Bug Fixes

* correct Android spotlight onboarding positioning ([fce2705](https://github.com/kk-11/capitillian/commit/fce270576e9e9674123e842c04d382e37b1d0aa5))
* reset spotlight onboarding to first step on close, not reopen ([3ff3b56](https://github.com/kk-11/capitillian/commit/3ff3b56b01a560d99eb66f1bb486428614eb5f4f))

## [1.14.5](https://github.com/kk-11/capitillian/compare/v1.14.4...v1.14.5) (2026-07-29)


### Bug Fixes

* correct Sentry project name to capitillian ([a1da303](https://github.com/kk-11/capitillian/commit/a1da3033d2315e8b633998cd1a99a34ab3b909ce))
* reduce Sentry noise and harden premium purchase error handling ([d486d51](https://github.com/kk-11/capitillian/commit/d486d5159b1fd7147c7a559e9fa7890c2661ff34))
* restructure top bar into two rows to reduce crowding ([9dc0129](https://github.com/kk-11/capitillian/commit/9dc0129588b6dc5bc6d7f5aa7e941d07c1c3ad64))

## [1.14.4](https://github.com/kk-11/capitillian/compare/v1.14.3...v1.14.4) (2026-07-26)


### Bug Fixes

* bundle globe texture, country borders, and topojson lib locally ([d5f05d3](https://github.com/kk-11/capitillian/commit/d5f05d3aa19cf621a76c159e06267dc2323e0a4a))

## [1.14.3](https://github.com/kk-11/capitillian/compare/v1.14.2...v1.14.3) (2026-07-24)


### Reverts

* Revert "chore: stop semantic-release from committing version bumps back to main" ([89f9770](https://github.com/kk-11/capitillian/commit/89f9770a1474fc0aa9ed9975a3a29335491bcf05))

# [1.14.0](https://github.com/kk-11/capitillian/compare/v1.13.0...v1.14.0) (2026-07-23)


### Features

* add spotlight onboarding for hardcore toggle, categories, and pages ([9984222](https://github.com/kk-11/capitillian/commit/9984222aa28f13669a0e9d14149afe3a52239f29))

# [1.13.0](https://github.com/kk-11/capitillian/compare/v1.12.1...v1.13.0) (2026-06-24)


### Features

* add name-length and flag-pattern game modes, default to 5-letters HC ([d388dbd](https://github.com/kk-11/capitillian/commit/d388dbd2ff7e144040d0cdf31e9f7b176619b207))
* use satellite imagery texture on globe instead of procedural generation ([39d777d](https://github.com/kk-11/capitillian/commit/39d777df97d23ebcaef94042407292619b38100c))

## [1.12.1](https://github.com/kk-11/capitillian/compare/v1.12.0...v1.12.1) (2026-06-16)


### Bug Fixes

* make mode dropdown items tappable on Android, increase hit area ([3160839](https://github.com/kk-11/capitillian/commit/316083960891e931dd4f23658c2a6f75e6d9263d))

# [1.12.0](https://github.com/kk-11/capitillian/compare/v1.11.2...v1.12.0) (2026-06-16)


### Features

* remove dev premium bypass, add sentry events for ([f728dc5](https://github.com/kk-11/capitillian/commit/f728dc5cb4c5b26b0b7746d90e318c0c7f4f7eaa))

## [1.11.2](https://github.com/kk-11/capitillian/compare/v1.11.1...v1.11.2) (2026-06-16)


### Bug Fixes

* procedural globe texture and android webview rendering ([fccd86a](https://github.com/kk-11/capitillian/commit/fccd86a80c93e786167f3cb3add39b65c7a4486e))

## [1.11.1](https://github.com/kk-11/capitillian/compare/v1.11.0...v1.11.1) (2026-05-21)


### Bug Fixes

* add zaire ([5d0165f](https://github.com/kk-11/capitillian/commit/5d0165fe1796eb52d335196b86f27a37c3118923))

# [1.11.0](https://github.com/kk-11/capitillian/compare/v1.10.0...v1.11.0) (2026-05-13)


### Bug Fixes

* use non-resolving promise in initial ([60b169f](https://github.com/kk-11/capitillian/commit/60b169fca01631de125562d3879da7a551edc45a))


### Features

* goals polish, remove streak, awards ordering and header styles ([118748c](https://github.com/kk-11/capitillian/commit/118748c99dbe0150afba1ce22c3c483f3029df02))

# [1.10.0](https://github.com/kk-11/capitillian/compare/v1.9.0...v1.10.0) (2026-05-12)


### Features

* vignette fade-out on easy, pill toggle, header polish ([a9b4105](https://github.com/kk-11/capitillian/commit/a9b410586be994a6bca4d614bc0c254efbf64031))

# [1.9.0](https://github.com/kk-11/capitillian/compare/v1.8.0...v1.9.0) (2026-05-12)


### Features

* staggered intro animations, globe first-card focus, dev premium bypass ([e3c399e](https://github.com/kk-11/capitillian/commit/e3c399eab7d7e354ee3e0a898526b11fc753c033))

# [1.8.0](https://github.com/kk-11/capitillian/compare/v1.7.2...v1.8.0) (2026-05-12)


### Features

* bright theme, cel-shaded globe, ([e7ca2c9](https://github.com/kk-11/capitillian/commit/e7ca2c9c37a5ef9fbdd6e80a47c8c6f61ce47b1a))

## [1.7.2](https://github.com/kk-11/capitillian/compare/v1.7.1...v1.7.2) (2026-05-07)


### Bug Fixes

* match RevenueCat entitlement id Capitillian Premium ([854199d](https://github.com/kk-11/capitillian/commit/854199d4735c5376d1a1e111dfc7cc947e4624cd))

## [1.7.1](https://github.com/kk-11/capitillian/compare/v1.7.0...v1.7.1) (2026-05-06)


### Bug Fixes

* skip RevenueCat init and guard ([abf4e53](https://github.com/kk-11/capitillian/commit/abf4e53ab79bd8971b73029421ea2d72076be071))

# [1.7.0](https://github.com/kk-11/capitillian/compare/v1.6.0...v1.7.0) (2026-05-06)


### Features

* sort goals by region size, world ([5ddfc99](https://github.com/kk-11/capitillian/commit/5ddfc99557418b78ec8fa7a112476c86ffa95885))

# [1.6.0](https://github.com/kk-11/capitillian/compare/v1.5.0...v1.6.0) (2026-05-06)


### Features

* switch UI from dark to light cream ([f72adba](https://github.com/kk-11/capitillian/commit/f72adba5cf75da4c8377b369fab7a52ff9a15007))

# [1.5.0](https://github.com/kk-11/capitillian/compare/v1.4.1...v1.5.0) (2026-04-27)


### Features

* new icon, alternate icon unlock system, 3D screenshot gallery ([7ccdf3f](https://github.com/kk-11/capitillian/commit/7ccdf3f2545de99cecfbde3260cf32987283b103))
* update all icons to derive from new KAWS globe design ([c24a089](https://github.com/kk-11/capitillian/commit/c24a089f00964ceef5941c14af701922a8b68111))

## [1.4.1](https://github.com/kk-11/capitillian/compare/v1.4.0...v1.4.1) (2026-04-27)


### Bug Fixes

* revert daily play limit to 3 ([eee703f](https://github.com/kk-11/capitillian/commit/eee703f4f0b5a411c7ff38b542c65329eed370b3))

# [1.4.0](https://github.com/kk-11/capitillian/compare/v1.3.0...v1.4.0) (2026-04-27)


### Features

* badge tier state logic with HC window, ([2e29de2](https://github.com/kk-11/capitillian/commit/2e29de27e84c91c2a9a7c7397033c59701fe5529))

# [1.3.0](https://github.com/kk-11/capitillian/compare/v1.2.5...v1.3.0) (2026-04-27)


### Features

* dual badge tracks (easy awakens, hardcore ([7ba8a0a](https://github.com/kk-11/capitillian/commit/7ba8a0ab39592fb8e957347b42feb017e276a406))
* landlocked + island as game modes with emoji ([f7e5a4a](https://github.com/kk-11/capitillian/commit/f7e5a4a0399c65fb17ff7255f45e8660fe002597))

## [1.2.5](https://github.com/kk-11/capitillian/compare/v1.2.4...v1.2.5) (2026-04-09)


### Bug Fixes

* install expo-asset peer ([ab8f2f6](https://github.com/kk-11/capitillian/commit/ab8f2f6e90c368f12a0a03ec356d1e87e2e6fa1a))

## [1.2.4](https://github.com/kk-11/capitillian/compare/v1.2.3...v1.2.4) (2026-04-09)


### Bug Fixes

* add sentry.properties for EAS build dSYM ([add2b3b](https://github.com/kk-11/capitillian/commit/add2b3b072716287e3dbb29625f04751d682aacb))

## [1.2.3](https://github.com/kk-11/capitillian/compare/v1.2.2...v1.2.3) (2026-04-09)


### Bug Fixes

* eas versions ([ea9d934](https://github.com/kk-11/capitillian/commit/ea9d9346e5b92c359ab08a92f0490411a7e27aff))

## [1.2.2](https://github.com/kk-11/capitillian/compare/v1.2.1...v1.2.2) (2026-04-09)


### Bug Fixes

* enforce daily limit on app reopen and show countdown ([d090dd7](https://github.com/kk-11/capitillian/commit/d090dd7515deb023b992b13e6747efdb1d5c5726))

## [1.2.1](https://github.com/kk-11/capitillian/compare/v1.2.0...v1.2.1) (2026-04-09)


### Bug Fixes

* remove redundadep ([8dadaec](https://github.com/kk-11/capitillian/commit/8dadaecd2ff8abef0a97c3447fa055c76f216c60))

# [1.2.0](https://github.com/kk-11/capitillian/compare/v1.1.1...v1.2.0) (2026-04-08)


### Bug Fixes

* web game score shows X/197, CTA interrupts every 5 correct matches ([217dc08](https://github.com/kk-11/capitillian/commit/217dc0854cb7e2010da67279f61590ee861d1da2))


### Features

* add landing page with embedded geography quiz game ([e63cb4f](https://github.com/kk-11/capitillian/commit/e63cb4f20bc1a04b19d2183cdd752f1b48526344))
* add sound effects for card interactions ([1091258](https://github.com/kk-11/capitillian/commit/10912584da2ff8577045c89b6ca4290985e19370))
* highlight daily streak on end screen and landing page ([4e23ff3](https://github.com/kk-11/capitillian/commit/4e23ff3484f883085e60fa3159a5655b93696ef3))
* replace play-again with app download CTA on web game completion ([6736443](https://github.com/kk-11/capitillian/commit/673644379be894bfbfd0cfcb2b7798c46ca03311))
* web game uses all 197 countries with app CTA between rounds ([40ed9ea](https://github.com/kk-11/capitillian/commit/40ed9ea1d072268230fb81d3d6cb8f62e2e4da8b))

## [1.1.1](https://github.com/kk-11/capitillian/compare/v1.1.0...v1.1.1) (2026-04-08)


### Bug Fixes

* icon ([d71ec97](https://github.com/kk-11/capitillian/commit/d71ec979dc0d20027e1ff8ecb217cb2e00960442))

# [1.1.0](https://github.com/kk-11/capitillian/compare/v1.0.0...v1.1.0) (2026-04-08)


### Features

* add haptic feedback for card select, match, and ([5c03877](https://github.com/kk-11/capitillian/commit/5c0387726faafc12cdd3af9421514ab3e71b3a9f))

# 1.0.0 (2026-04-08)


### Bug Fixes

* bump CI node version to 22 for semantic-release ([6a38a41](https://github.com/kk-11/capitillian/commit/6a38a41bf6ae4dab4f77be3234a5c9915c6ac01f))


### Features

* add tests, CI pipeline, and semantic versioning ([79c66fe](https://github.com/kk-11/capitillian/commit/79c66fed1eede7fa959dfcc3caaafcba28432b23))
* globe zooms to selected country + palestine easter egg ([b4d2a51](https://github.com/kk-11/capitillian/commit/b4d2a519c08719f5acbea9dad614a32983eec0f5))
