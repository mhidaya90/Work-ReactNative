# dairyenteligen_mobile

This is ReactNative code repo created for Dairy Enteligen Code, which is a newer version developed by Folio3 Team.

## Working Branches

- `master`: always keep this updated with PROD stable release
- `releases/QA`: updated with latest QA build
- `releases/UAT`: updated with latest Staging build
- `releases/PROD`: updated with latest PROD build (uploaded on stores)
- `fixes/QA`: updated with latest QA build - used for fixes after that specific release. needs to be merged in development
- `fixes/UAT`: updated with latest Staging build - used for fixes after that specific release. needs to be merged in development
- `fixes/PROD`: updated with latest Prod build - used for fixes after that specific release. needs to be merged in development
- `development`: updated with latest stable released code
  Every feature will have their seprate branches from latest `development` in the format of `features/{featureName}`

---

## Project Setup

1- Clone project and run `yarn`
2- Add `local.properties` file under `app-root/android/` and add the following content as per your OS.

- Windows: `sdk.dir = C:\\Users\\USERNAME\\AppData\\Local\\Android\\sdk`
- MacOS: `sdk.dir = /Users/USERNAME/Library/Android/sdk`
- Linux: `sdk.dir = /home/USERNAME/Android/Sdk`

---

## Prerequisites on new package addition

### For Android:

1. `npx jetify` (it runs in the postinstall target of your package.json)
   test by `yarn android` (your app should correctly compile and work)
   Any time your dependencies update you have to jetify again, to jetify / convert node_modules dependencies to AndroidX

### For iOS:

1. run `cd ios && pod install` OR `npx pod-install ios`
2. add .xcode.env under ios folder if not already and add
  `export NODE_BINARY=/opt/homebrew/bin/node` or node path of your mac

## Builds

- Commit all your remaining work
- Make sure to checkout env release branch
- Update ANDROID_VERSION_NAME & IOS_VERSION_NAME in env.qa/staging/Prod as applicable
- Update ANDROID_VERSION_CODE & IOS_VERSION_CODE in env.qa/staging/Prod as applicable

### Android:

- Update index.android.bundle:
  `npm run update-android-bundle` or `yarn update-android-bundle`

- Then run command according to env `npm run build-android-release-{env}` or `yarn build-android-release-{env}`
- For store run `cd android && ./gradlew bundle`

### iOS:

- Update main.jsbundle:
  `npm run update-ios-bundle` or `yarn update-ios-bundle`

- Select proper scheme
- Create Archive from XCode
- Distribute app
- Make Enterprise builds for all (QA, Stage, PROD)

## Database

### Migrations

Whenever you have to add new columns or new tables to the database, so you have to make sure that it is be backward compatible as well. 

> :warning: **Without migrations**:  If a user of your app upgrades from one version to another, their local database will be cleared at launch, and they will lose all their data!

Follow these steps in **same order** to make sure that you havn't made any mistake

- Create a new file inside [migrations](https://git.cglcloud.com/EMEA-Tech-Services/dairyenteligen_mobile/tree/develop/src/database/migration) folder with incremental name e.g `version3.js`. File name could be anything, we are just naming like this for consistency.

- Add migration which must be a version one above the previous migration, and write step in it e.g

```
  export const version3Migrations = {
    toVersion: 3,
    steps: [
    addColumns({
      table: 'visit',
      columns: [
        { name: 'visitId', type: 'string' },
        { name: 'visitName', type: 'string' },
      ],
    }),
    addColumns({
      table: 'user',
      columns: [
        { name: 'userId', type: 'string' },
      ],
    }),
    createTable({
      name: 'site',
      columns: [
        { name: "site_id", type: "number", isIndexed: true },
        { name: "name", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ]
};
```
- Import and add migration file you just created in [migration/index.js](https://git.cglcloud.com/EMEA-Tech-Services/dairyenteligen_mobile/blob/develop/src/database/migration/index.js).

- Make same changes in the schema of that table. After adding the changes you would see error "Migrations can't be newer than schema". If you see a       different error then there could be syntax error.

   :warning: Make sure that changes you ae going to add in schema are same as added in migrations file. Otherwise it will not work for fresh install.

- After making changes in the schemas and migrations, now bump the scema version in [schema/index.js](https://git.cglcloud.com/EMEA-Tech-Services/dairyenteligen_mobile/blob/develop/src/database/schema/index.js). Schema version would be the one you added while adding migrations.

- On refreshing again, app should work without any issue and you can use the newly added columns and tables. :man_dancing:



## OTA update push

update `APP_VERSION` with latest version number (this will not be native, its just to show on drawer for identification)

`appcenter codepush release-react -a {owner_name}/{app_Name} -t 'version' -m -d {env (QA/UAT/Production)}`


## troubleshooting

for `react-native-pdf` showing blank page on ios, please add to its package.json in node_modules

 "ios": {
            "componentProvider": {
                "RNPDFPdfView": "RNPDFPdfView"
            }
        }
        
iOS Commmands:
	•	yarn ios:dev - Development environment
	•	yarn ios:qa - QA environment
	•	yarn ios:staging - Staging (UAT) environment
	•	yarn ios:prod - Production environment
	•	yarn ios:internalProd - Internal Production environment
Android Commands:
	•	yarn android:dev - Development environment
	•	yarn android:qa - QA environment
	•	yarn android:staging - Staging (UAT) environment
	•	yarn android:prod - Production environment
	•	yarn android:internalProd - Internal Production environment