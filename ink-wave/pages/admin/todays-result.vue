<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <!-- <v-col cols="12" sm="8"> -->
            <v-card class="mb-3">
                <v-card-title class="headline">
                    Todays Result
                </v-card-title>
                <v-card-text>
                    <v-row justify="start">
                        <!-- Team A情報 -->
                        <v-col cols="5">
                            <v-text-field v-model="inputEntryLineA" label="Team A"
                                hint="申請リストから行コピーして貼り付けしてください"></v-text-field>
                        </v-col>
                        <!-- Team B情報 -->
                        <v-col cols="5">
                            <v-text-field v-model="inputEntryLineB" label="Team B"
                                hint="申請リストから行コピーして貼り付けしてください"></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-btn color="primary" @click="inputData"> 取り込む </v-btn>
                        </v-col>

                        <!-- チーム名 -->
                        <v-col cols="12">
                            <v-text-field v-model="inputTeamNameA" label="Team NameA"></v-text-field>
                        </v-col>
                        <!-- メンバー情報 -->
                        <v-col v-for="i in 5" :key="i" cols="12" sm="6">
                            <v-row justify="start">
                                <v-col cols="12">
                                    <v-text-field v-model="inputPlayerNameA[i - 1]" maxlength="10"
                                        :label="'Player' + i"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                        <!-- チームロゴ -->
                        <v-col cols="8">
                            <v-file-input v-model="logoImageA" label="Logo ImageA" :disabled="defaultLogoA!"></v-file-input>
                        </v-col>
                        <v-col cols="3">
                            <v-select v-model="defaultLogoA" :items="logoData" item-title="name" item-value="id"
                                density="compact" label="Default LogoA" :disabled="Array.isArray(logoImageA) && logoImageA[0] !== undefined"></v-select>
                        </v-col>
                        <v-col cols="1">
                            <v-img v-if="defaultLogoA" :src="selectLogo(defaultLogoA)!" max-height="50" max-width="50"></v-img>
                        </v-col>

                        <!-- チーム名 -->
                        <v-col cols="12">
                            <v-text-field v-model="inputTeamNameB" label="Team NameB"></v-text-field>
                        </v-col>
                        <!-- メンバー情報 -->
                        <v-col v-for="i in 5" :key="i" cols="12" sm="6">
                            <v-row justify="start">
                                <v-col cols="12">
                                    <v-text-field v-model="inputPlayerNameB[i - 1]" maxlength="10"
                                        :label="'Player' + i"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                        <!-- チームロゴ -->
                        <v-col cols="8">
                            <v-file-input v-model="logoImageB" label="Logo ImageB" :disabled="defaultLogoB!"></v-file-input>
                        </v-col>
                        <v-col cols="3">
                            <v-select v-model="defaultLogoB" :items="logoData" item-title="name" item-value="id"
                                density="compact" label="Default LogoB" :disabled="Array.isArray(logoImageB) && logoImageB[0] !== undefined"></v-select>
                        </v-col>
                        <v-col cols="1">
                            <v-img v-if="defaultLogoB" :src="selectLogo(defaultLogoB)!" max-height="50" max-width="50"></v-img>
                        </v-col>

                        <v-col cols="3">
                            <v-text-field v-model="inputStartTime"
                                        label="START"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field v-model="inputCommentary"
                                        label="実況"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field v-model="inputExplanation"
                                        label="解説"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field v-model="inputObserver"
                                        label="オブザーバー"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="inputScoreA"
                                        label="ScoreA"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="inputScoreB"
                                        label="ScoreB"></v-text-field>
                        </v-col>

                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="generateImage"> スライド作成 </v-btn>
                </v-card-actions>
            </v-card>
            <v-card v-show="imageDataURL" class="pt-1 pr-1 pl-1">
                <canvas id="imageCanvas" class="confirm-image" :width="canvasWidth" :height="canvasHeight">
                </canvas>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" :href="imageDataURL" :download="imageName" v-if="imageDataURL">Download
                        Image</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {LOGO_DATA} from "@/consts/dataConst";

const inputTeamNameA = ref('')
const inputTeamNameB = ref('')
const inputPlayerNameA = ref([])
const inputPlayerNameB = ref([])
const inputEntryLineA = ref('')
const inputEntryLineB = ref('')
const logoImageA = ref()
const logoImageB = ref()
const defaultLogoA = ref(null)
const defaultLogoB = ref(null)
const inputScoreA = ref(0)
const inputScoreB = ref(0)

const inputCommentary = ref('')
const inputExplanation = ref('')
const inputObserver = ref('')
const inputStartTime = ref('')

const imageDataURL = ref(null)
const imageName = ref('generated_image.png')
const baseImageUrl = ref('/ink-wave-test/todays_result/todays_result.jpg')
const defaultLogoPath = ref('/ink-wave-test/default_logo/')
const canvasWidth = ref(1920)
const canvasHeight = ref(1080)

const logoData = LOGO_DATA

const canvas = ref()
const context = ref()

const generateImage = async (): Promise<Boolean> => {
    canvas.value = document.querySelector('#imageCanvas');
    if (!canvas || !canvas.value.getContext) return false;
    context.value = canvas.value.getContext('2d')

    // Draw base image
    const baseImage = new Image();
    baseImage.src = baseImageUrl.value;
    baseImage.onload = () => {
        context.value.drawImage(baseImage, 0, 0, canvasWidth.value, canvasHeight.value);

        // Draw text
        context.value.fillStyle = 'white';
        context.value.font = "bold 28px 'Noto Sans JP', sans-serif";

        context.value.fillText(inputStartTime.value, 973, 155);
        context.value.fillText(inputCommentary.value, 973, 205);
        context.value.fillText(inputExplanation.value, 973, 255);
        context.value.fillText(inputObserver.value, 973, 305);

        // チームロゴ
        const maxWidth = 425;
        const maxHeight = 425;
        const logoA = new Image();
        const logoB = new Image();

        let issetImageA = Array.isArray(logoImageA.value) && logoImageA.value[0] !== undefined
        let issetImageB = Array.isArray(logoImageB.value) && logoImageB.value[0] !== undefined

        const landingA = 233;
        const top = 124;
        if ((issetImageA && logoImageA.value && logoImageA.value[0].type && logoImageA.value[0].type.match('image/')) || defaultLogoA.value) {
            if (issetImageA && logoImageA.value && logoImageA.value[0].type && logoImageA.value[0].type.match('image/')) {
                logoA.src = URL.createObjectURL(logoImageA.value[0]); // ファイルからURLを生成
            } else {
                logoA.src = selectLogo(defaultLogoA.value)!;
            }

            logoA.onload = () => {
                let logoWidth = maxWidth;
                let logoHeight = maxHeight;
                // 比率が1:1の場合
                if (logoA.width === logoA.height) {
                    logoWidth = logoA.width <= maxWidth ? logoA.width : maxWidth;
                    logoHeight = logoA.height <= maxHeight ? logoA.height : maxHeight;
                } else if (logoA.width > logoA.height) { // ヨコが長い
                    logoWidth = logoA.width <= maxWidth ? logoA.width : maxWidth;
                    const ratio = logoA.width / logoWidth;
                    logoHeight = logoA.height / ratio;
                } else { // タテが長い
                    logoHeight = logoA.height <= maxHeight ? logoA.height : maxHeight;
                    const ratio = logoA.height / logoHeight;
                    logoWidth = logoA.width / ratio;
                }

                const x = (maxWidth + landingA - logoWidth) / 2 + landingA / 2;
                const y = (maxHeight + top - logoHeight) / 2 + top / 2;
                context.value.drawImage(logoA, x, y, logoWidth, logoHeight);
                if (issetImageA && logoImageA.value && logoImageA.value[0].type && logoImageA.value[0].type.match('image/')) URL.revokeObjectURL(logoA.src); // 不要になったURLを解放
                imageDataURL.value = canvas.value.toDataURL();
            }
        }

        const landingB = 1262;
        if ((issetImageB && logoImageB.value && logoImageB.value[0].type != "" && logoImageB.value[0].type.match('image/')) || defaultLogoB.value) {
            if (issetImageB && logoImageB.value && logoImageB.value[0].type && logoImageB.value[0].type.match('image/')) {
                logoB.src = URL.createObjectURL(logoImageB.value[0]); // ファイルからURLを生成
            } else {
                logoB.src = selectLogo(defaultLogoB.value)!;
            }

            logoB.onload = () => {
                let logoWidth = maxWidth;
                let logoHeight = maxHeight;
                // 比率が1:1の場合
                if (logoB.width === logoB.height) {
                    logoWidth = logoB.width <= maxWidth ? logoB.width : maxWidth;
                    logoHeight = logoB.height <= maxHeight ? logoB.height : maxHeight;
                } else if (logoB.width > logoB.height) { // ヨコが長い
                    logoWidth = logoB.width <= maxWidth ? logoB.width : maxWidth;
                    const ratio = logoB.width / logoWidth;
                    logoHeight = logoB.height / ratio;
                } else { // タテが長い
                    logoHeight = logoB.height <= maxHeight ? logoB.height : maxHeight;
                    const ratio = logoB.height / logoHeight;
                    logoWidth = logoB.width / ratio;
                }

                const x = (maxWidth + landingB - logoWidth) / 2 + landingB / 2;
                const y = (maxHeight + top - logoHeight) / 2 + top / 2;
                console.log([x, y])
                context.value.drawImage(logoB, x, y, logoWidth, logoHeight);
                if (issetImageB && logoImageB.value && logoImageB.value[0].type && logoImageB.value[0].type.match('image/')) URL.revokeObjectURL(logoB.src); // 不要になったURLを解放
                imageDataURL.value = canvas.value.toDataURL();
            }
        }

        // TEAM A
        context.value.fillStyle = '#BFCAE6';
        context.value.textAlign = "right";
        context.value.font = "bold 36px 'Noto Sans JP', sans-serif";
        context.value.fillText(inputTeamNameA.value, 725, 616);

        // MEMBER A
        context.value.fillStyle = 'white';
        context.value.font = "bold 42px 'Noto Sans JP', sans-serif";
        inputPlayerNameA.value.forEach(function (name, index) {
            context.value.fillText(name, 895, 713 + (index * 83));
        })

        // TEAM B
        context.value.fillStyle = '#BFCAE6';
        context.value.textAlign = "left";
        context.value.font = "bold 36px 'Noto Sans JP', sans-serif";
        context.value.fillText(inputTeamNameB.value, 1194, 616);

        // MEMBER B
        context.value.fillStyle = 'white';
        context.value.font = "bold 42px 'Noto Sans JP', sans-serif";
        inputPlayerNameB.value.forEach(function (name, index) {
            context.value.fillText(name, 1024, 713 + (index * 83));
        })

        context.value.font = "bold 218px 'Noto Sans JP', sans-serif";
        context.value.fillText(inputScoreA.value, 44, 1022);
        context.value.fillText(inputScoreB.value, 1770, 1022);

        imageDataURL.value = canvas.value.toDataURL();
    }
    return true;
}

const selectLogo = (id: number | null):string | null => {
    const logo = logoData.find(logo => logo.id === id);
    if (logo) {
        return defaultLogoPath.value + logo.image + '.png'
    } else {
        return null
    }
}

const inputData = () => {
    let splitDataA = []
    let splitDataB = []

    // チームA
    if (inputEntryLineA.value) {
        splitDataA = inputEntryLineA.value.split('\t');
        console.log(splitDataA)
        inputPlayerNameA.value = []

        if (splitDataA.length > 31) {
            inputTeamNameA.value = splitDataA[1]
            inputPlayerNameA.value.push(splitDataA[5], splitDataA[11], splitDataA[16], splitDataA[21])

            if (splitDataA[3] !== "") {
                // logoImageA = splitData[3]
            } else {
                defaultLogoA.value = getDefaultLog(splitDataA[4])
            }
        }
    }
    // チームB
    if (inputEntryLineB.value) {
        splitDataB = inputEntryLineB.value.split('\t');
        inputPlayerNameB.value = []

        if (splitDataB.length > 31) {
            inputTeamNameB.value = splitDataB[1]
            inputPlayerNameB.value.push(splitDataB[5], splitDataB[11], splitDataB[16], splitDataB[21])

            if (splitDataB[3] !== "") {
                // logoImageB = splitData[3]
            } else {
                defaultLogoB.value = getDefaultLog(splitDataB[4])
            }
        }
    }
}

const getDefaultLog = (logo: string):number => {
    switch (logo) {
        case 'ブルー':
            return 1
        case 'レッド':
            return 2
        case 'グリーン':
            return 3
        case 'オレンジ':
            return 4
        default:
            return 0
    }
}


</script>

<style scoped>
.confirm-image {
    width: 100%;
    height: auto;
}
</style>
