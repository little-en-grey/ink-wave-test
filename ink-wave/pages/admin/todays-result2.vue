<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <!-- <v-col cols="12" sm="8"> -->
            <v-card class="mb-3">
                <v-card-title class="headline">
                    Todays Result
                </v-card-title>
                <v-card-text>
                    <v-row v-for="i in count" :key="i" justify="start">
                        <v-col cols="12">
                            <div class="text-subtitle-1">Result{{ i }}</div>
                        </v-col>
                        <!-- チーム名 -->
                        <v-col cols="5">
                            <v-text-field v-model="inputTeamNameA[i - 1]" label="Team NameA"></v-text-field>
                        </v-col>
                        <!-- チームロゴ -->
                        <v-col cols="3">
                            <v-file-input v-model="logoImageA[i - 1]" label="Logo ImageA"
                                :disabled="defaultLogoA[i - 1]"></v-file-input>
                        </v-col>
                        <v-col cols="2">
                            <v-select v-model="defaultLogoA[i - 1]" :items="logoData" item-title="name" item-value="id"
                                density="compact" label="Default LogoA" :disabled="Array.isArray(logoImageA[i - 1]) && logoImageA[i - 1][0] !== undefined"></v-select>
                        </v-col>
                        <v-col cols="1">
                            <v-img v-if="defaultLogoA[i - 1]" :src="selectLogo(defaultLogoA[i - 1])!" max-height="50"
                                max-width="50"></v-img>
                        </v-col>
                        <v-col cols="1">
                            <v-select v-model="inputScoreA[i - 1]" :items="[0, 1, 2, 3]" label="ScoreA"></v-select>
                        </v-col>

                        <!-- チーム名 -->
                        <v-col cols="5">
                            <v-text-field v-model="inputTeamNameB[i - 1]" label="Team NameB"></v-text-field>
                        </v-col>
                        <!-- チームロゴ -->
                        <v-col cols="3">
                            <v-file-input v-model="logoImageB[i - 1]" label="Logo ImageB"
                                :disabled="defaultLogoB[i - 1]"></v-file-input>
                        </v-col>
                        <v-col cols="2">
                            <v-select v-model="defaultLogoB[i - 1]" :items="logoData" item-title="name" item-value="id"
                                density="compact" label="Default LogoB" :disabled="Array.isArray(logoImageB[i - 1]) && logoImageB[i - 1][0] !== undefined"></v-select>
                        </v-col>
                        <v-col cols="1">
                            <v-img v-if="defaultLogoB[i - 1]" :src="selectLogo(defaultLogoB[i - 1])!" max-height="50"
                                max-width="50"></v-img>
                        </v-col>
                        <v-col cols="1">
                            <v-select v-model="inputScoreB[i - 1]" :items="[0, 1, 2, 3]" label="ScoreB"></v-select>
                        </v-col>
                    </v-row>
                    <!-- サムネ関係 -->
                    <v-row justify="start">
                        <v-col cols="12">
                            <div class="text-subtitle-1">配信サムネ作成</div>
                        </v-col>
                        <!-- DAY -->
                        <v-col cols="3">
                            <v-text-field v-model="dayNo" label="DAY"></v-text-field>
                        </v-col>
                        <!-- Season -->
                        <v-col cols="3">
                            <v-text-field v-model="seasonNo" label="Season"></v-text-field>
                        </v-col>
                        <!-- 実況 -->
                        <v-col cols="3">
                            <v-file-input v-model="logoImageCommentary" label="実況アイコン"></v-file-input>
                        </v-col>
                        <!-- 解説 -->
                        <v-col cols="3">
                            <v-file-input v-model="logoImageExplanation" label="解説アイコン"></v-file-input>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="generateImage"> スライド作成 </v-btn>
                    <v-btn color="red darken-3" @click="generateImageThumbnail">サムネイル作成</v-btn>
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

const count = ref(4)
const inputTeamNameA = ref([])
const inputTeamNameB = ref([])
const inputScoreA = ref([])
const inputScoreB = ref([])
const logoImageA = ref([])
const logoImageB = ref([])
const defaultLogoA = ref([])
const defaultLogoB = ref([])

const imageDataURL = ref(null)
const imageName = ref('generated_image.png')
const baseImageUrl = ref('/ink-wave-test/todays_result/todays_result2.jpg')
const defaultLogoPath = ref('/ink-wave-test/default_logo/')
const thumbnailImageUrl = ref('/ink-wave-test/todays_result/thumb.jpg')
const canvasWidth = ref(1920)
const canvasHeight = ref(1080)

const logoData = LOGO_DATA

const seasonNo = ref('')
const dayNo = ref('')
const logoImageCommentary = ref()
const logoImageExplanation = ref()

const canvas = ref()
const context = ref()

const generateImage = async (): Promise<Boolean> => {
    canvas.value = document.querySelector('#imageCanvas');
    if (!canvas.value || !canvas.value.getContext) return false;
    context.value = canvas.value.getContext('2d')

    const baseImage = new Image();
    baseImage.src = baseImageUrl.value;

    baseImage.onload = () => {
        context.value.drawImage(baseImage, 0, 0, canvasWidth.value, canvasHeight.value);

        // Draw text
        context.value.fillStyle = 'white';

        // チームロゴ
        const maxWidth = 172;
        const maxHeight = 172;

        const landingA = 44;
        const landingB = 1692;
        const top = 233;

        for (let i = 0; i < count.value; i++) {
            const logoA = new Image();
            const logoB = new Image();

            let issetImageA = Array.isArray(logoImageA.value[i]) && logoImageA.value[i][0] !== undefined
            let issetImageB = Array.isArray(logoImageB.value[i]) && logoImageB.value[i][0] !== undefined

            if ((issetImageA && logoImageA.value[i][0].type && logoImageA.value[i][0].type.match('image/')) || defaultLogoA.value[i]) {
                if (issetImageA && logoImageA.value[i][0].type && logoImageA.value[i][0].type.match('image/')) {
                    logoA.src = URL.createObjectURL(logoImageA.value[i][0]); // ファイルからURLを生成
                } else {
                    logoA.src = selectLogo(defaultLogoA.value[i]);
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
                    const y = (maxHeight + (top + (i * 180)) - logoHeight) / 2 + (top + (i * 180)) / 2;
                    context.value.drawImage(logoA, x, y, logoWidth, logoHeight);
                    if (issetImageA && logoImageA.value[i][0].type && logoImageA.value[i][0].type.match('image/')) URL.revokeObjectURL(logoA.src); // 不要になったURLを解放
                    imageDataURL.value = canvas.value.toDataURL();
                }
            }

            
            if ((issetImageB && logoImageB.value[i][0].type && logoImageB.value[i][0].type.match('image/')) || defaultLogoB.value[i]) {
                if (issetImageB && logoImageB.value[i][0].type && logoImageB.value[i][0].type.match('image/')) {
                    logoB.src = URL.createObjectURL(logoImageB.value[i][0]); // ファイルからURLを生成
                } else {
                    logoB.src = selectLogo(defaultLogoB.value[i]);
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
                    const y = (maxHeight + (top + (i * 180)) - logoHeight) / 2 + (top + (i * 180)) / 2;
                    context.value.drawImage(logoB, x, y, logoWidth, logoHeight);
                    if (issetImageB && logoImageB.value[i][0].type && logoImageB.value[i][0].type.match('image/')) URL.revokeObjectURL(logoB.src); // 不要になったURLを解放
                    imageDataURL.value = canvas.value.toDataURL();
                }
            }

            // TEAM A
            context.value.textAlign = "right";
            context.value.font = "bold 50px 'Noto Sans JP', sans-serif";
            if (inputTeamNameA.value[i] !== undefined) context.value.fillText(inputTeamNameA.value[i], 775, 338 + (i * 180));

            // TEAM B
            context.value.textAlign = "left";
            if (inputTeamNameB.value[i] !== undefined) context.value.fillText(inputTeamNameB.value[i], 1144, 338 + (i * 180));

            context.value.font = "bold 110px 'Noto Sans JP', sans-serif";
            // スコアA
            if (inputScoreA.value[i] !== undefined) context.value.fillText(inputScoreA.value[i], 835, 358 + (i * 180));
            // スコアB
            if (inputScoreB.value[i] !== undefined) context.value.fillText(inputScoreB.value[i], 1040, 358 + (i * 180));
        }
        imageDataURL.value = canvas.value.toDataURL();
    }
}
const generateImageThumbnail = async (): Promise<Boolean> => {
    canvas.value = document.querySelector('#imageCanvas');
    if (!canvas || !canvas.value.getContext) return false;
    context.value = canvas.value.getContext('2d')

    const baseImage = new Image();
    baseImage.src = thumbnailImageUrl.value;

    baseImage.onload = () => {
        context.value.drawImage(baseImage, 0, 0, canvasWidth.value, canvasHeight.value);

        // Draw text
        context.value.fillStyle = 'white';

        // チームロゴ
        const maxWidth = 164;
        const maxHeight = 164;

        const landingA = 139;
        const landingB = 1607;
        const top = 325;

        for (let i = 0; i < count.value; i++) {
            const logoA = new Image();
            const logoB = new Image();

            let issetImageA = Array.isArray(logoImageA.value[i]) && logoImageA.value[i][0] !== undefined
            let issetImageB = Array.isArray(logoImageB.value[i]) && logoImageB.value[i][0] !== undefined

            if ((issetImageA && logoImageA.value[i][0].type && logoImageA.value[i][0].type.match('image/')) || defaultLogoA.value[i]) {
                if (issetImageA && logoImageA.value[i][0].type && logoImageA.value[i][0].type.match('image/')) {
                    logoA.src = URL.createObjectURL(logoImageA.value[i][0]); // ファイルからURLを生成
                } else {
                    logoA.src = selectLogo(defaultLogoA.value[i]);
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
                    const y = (maxHeight + (top + (i * 180)) - logoHeight) / 2 + (top + (i * 180)) / 2;
                    context.value.drawImage(logoA, x, y, logoWidth, logoHeight);
                    if (issetImageA && logoImageA.value[i][0].type && logoImageA.value[i][0].type.match('image/')) URL.revokeObjectURL(logoA.src); // 不要になったURLを解放
                    imageDataURL.value = canvas.value.toDataURL();
                }
            }

            if ((issetImageB && logoImageB.value[i][0].type && logoImageB.value[i][0].type.match('image/')) || defaultLogoB.value[i]) {
                if (issetImageB && logoImageB.value[i][0].type && logoImageB.value[i][0].type.match('image/')) {
                    logoB.src = URL.createObjectURL(logoImageB.value[i][0]); // ファイルからURLを生成
                } else {
                    logoB.src = selectLogo(defaultLogoB.value[i]);
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
                    const y = (maxHeight + (top + (i * 180)) - logoHeight) / 2 + (top + (i * 180)) / 2;
                    context.value.drawImage(logoB, x, y, logoWidth, logoHeight);
                    if (issetImageB && logoImageB.value[i][0].type && logoImageB.value[i][0].type.match('image/')) URL.revokeObjectURL(logoB.src); // 不要になったURLを解放
                    imageDataURL.value = canvas.value.toDataURL();
                }
            }

            // TEAM A
            context.value.textAlign = "right";
            context.value.font = "bold 50px 'Noto Sans JP', sans-serif";
            if (inputTeamNameA.value[i] !== undefined) context.value.fillText(inputTeamNameA.value[i], 855, 430 + (i * 180));

            // TEAM B
            context.value.textAlign = "left";
            if (inputTeamNameB.value[i] !== undefined) context.value.fillText(inputTeamNameB.value[i], 1063, 430 + (i * 180));
        }
        // Day
        const dayMaxWidth = 125;
        let fontSize = 150;
        const dayTextWidth = context.value.measureText( dayNo.value ).width;
        // 横幅が最大幅を超える場合は、フォントサイズを調整
        if (dayTextWidth > dayMaxWidth) {
            // 適当なフォントサイズに調整するロジックを追加
            fontSize = Math.floor(fontSize * (dayMaxWidth / dayTextWidth));
        }
        context.value.font = `bold ${fontSize}px 'Noto Sans JP', sans-serif`;
        context.value.fillStyle = 'white';
        context.value.fillText(dayNo.value, 1008, 275);

        // Season
        const seasonMaxWidth = 900;
        fontSize = 40;
        // const splitSeasonText = this.seasonNo.split('').join(' ');
        const seasonTextWidth = context.value.measureText( seasonNo.value ).width;
        // 横幅が最大幅を超える場合は、フォントサイズを調整
        if (seasonTextWidth > seasonMaxWidth) {
            // 適当なフォントサイズに調整するロジックを追加
            fontSize = Math.floor(fontSize * (seasonMaxWidth / seasonTextWidth));
        }
        
        context.value.font = `bold ${fontSize}px 'Noto Sans JP', sans-serif`;
        context.value.fillStyle = '#332771';

        const x = (295 + 1044 - context.value.measureText( seasonNo.value ).width) / 2 + 1044 / 2;
        context.value.fillText(seasonNo.value, x, 126);
        console.log('seasonTextWidth:' + seasonTextWidth);
        console.log('x:' + x);

        // 実況解説アイコン
        const iconMaxSize = 211;
        const iconTop = 68;
        const commentaryImage = new Image();
        if (logoImageCommentary.value && logoImageCommentary.value[0].type && logoImageCommentary.value[0].type.match('image/')) {
            commentaryImage.src = URL.createObjectURL(logoImageCommentary.value[0]);
            commentaryImage.onload = () => {

                context.value.drawImage(commentaryImage, 282 - 60, iconTop, iconMaxSize, iconMaxSize);
                URL.revokeObjectURL(commentaryImage.src);
                imageDataURL.value = canvas.value.toDataURL();
            }
        }

        const explanationImage = new Image();
        if (logoImageExplanation.value && logoImageExplanation.value[0].type && logoImageExplanation.value[0].type.match('image/')) {
            explanationImage.src = URL.createObjectURL(logoImageExplanation.value[0]);
            explanationImage.onload = () => {
                context.value.drawImage(explanationImage, 1427 + 60, iconTop, iconMaxSize, iconMaxSize);
                URL.revokeObjectURL(explanationImage.src);
                imageDataURL.value = canvas.value.toDataURL();
            }
        }


        imageDataURL.value = canvas.value.toDataURL();
    }
}

const selectLogo = (id: number):string | null => {
    const logo = logoData.find(logo => logo.id === id);
    if (logo) {
        return defaultLogoPath.value + logo.image + '.png'
    } else {
        return null
    }
}
</script>

<style scoped>
.confirm-image {
    width: 100%;
    height: auto;
}</style>
