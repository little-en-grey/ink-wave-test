<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <!-- <v-col cols="12" sm="8"> -->
            <v-card class="mb-3">
                <v-card-title class="headline">
                    チーム紹介カード
                </v-card-title>
                <v-card-text>
                    <v-row justify="start">
                        <v-col cols="9">
                            <v-text-field v-model="inputEntryLine" label="Entry Line"
                                hint="申請リストから行コピーして貼り付けしてください"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-btn color="primary" @click="inputData"> 申請データを取り込む </v-btn>
                        </v-col>
                        <!-- チーム名 -->
                        <v-col cols="12">
                            <v-text-field v-model="inputTeamName" label="Team Name"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="start">
                        <!-- メンバー情報 -->
                        <v-col v-for="i in 5" :key="i" cols="12" sm="6">
                            <v-row justify="start">
                                <v-col cols="12">
                                    <div class="text-subtitle-1">Player{{ i }}
                                        <template v-if="i == 1">(Leader)</template>
                                        <template v-else-if="i == 5">(Super Sub)</template>
                                    </div>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field v-model="inputPlayerName[i - 1]" maxlength="10"
                                        label="Name"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-select v-model="selectPlayerWeapons[i - 1]" :items="allWeaponsData" item-title="name"
                                        item-value="filename" density="compact" chips multiple label="Weapons"
                                        :menu-props="menuProps"></v-select>
                                </v-col>
                                <v-col cols="6">
                                    <v-select v-model="selectRange[i - 1]" :items="rangeData" item-title="name"
                                        item-value="id" density="compact" label="Range"></v-select>
                                </v-col>
                                <v-col cols="6">
                                    <v-select v-model="selectRole[i - 1]" :items="roleData" item-title="name"
                                        item-value="tag" density="compact" label="Role"></v-select>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row justify="start">
                        <!-- チームロゴ -->
                        <v-col cols="8">
                            <v-file-input v-model="logoImage" label="Logo Image" :disabled="defaultLogo"></v-file-input>
                        </v-col>
                        <v-col cols="3">
                            <v-select v-model="defaultLogo" :items="logoData" item-title="name" item-value="id"
                                density="compact" label="Default Logo" :disabled="Array.isArray(logoImage) && logoImage[0] !== undefined"></v-select>
                        </v-col>
                        <v-col cols="1">
                            <v-img v-if="defaultLogo" :src="selectLogo!" max-height="50" max-width="50"></v-img>
                        </v-col>

                        <!-- ランクアイコン -->
                        <v-col cols="11">
                            <v-select v-model="rankIcon" :items="rankIconData" item-title="name" item-value="id"
                                density="compact" label="Rank Icon"></v-select>
                        </v-col>
                        <v-col cols="1">
                            <v-img v-if="rankIcon" :src="selectRankIcon!" max-height="50" max-width="50"></v-img>
                        </v-col>

                        <!-- 実績 -->
                        <v-col v-for="i in 3" cols="4" :key="i">
                            <v-text-field v-model="inputAchievements[i - 1]" :label="'Achievements' + i"></v-text-field>
                        </v-col>

                        <!-- 最高WP -->
                        <v-col cols="4">
                            <v-text-field v-model="inputBestWP" label="最高WP"></v-text-field>
                        </v-col>

                        <!-- 最終WP -->
                        <v-col cols="4">
                            <v-text-field v-model="inputFinalWP" label="最終WP"></v-text-field>
                        </v-col>

                        <!-- 順位 -->
                        <v-col cols="2">
                            <v-text-field v-model="inputRank" label="順位"></v-text-field>
                        </v-col>

                        <!-- シーズン -->
                        <v-col cols="2">
                            <v-text-field v-model="inputSeason" label="Season"></v-text-field>
                        </v-col>

                        <!-- メモ -->
                        <v-col cols="12">
                            <v-textarea label="Comment" v-model="inputComment" hint="145文字まで(29文字ごとに自動で改行されます)"
                                maxlength="145"></v-textarea>
                        </v-col>
                        <v-col v-for="i in 6" :key="i" cols="2">
                            <v-text-field :label="'Label Name' + i" v-model="labels[i - 1]"
                                @change="fillData"></v-text-field>
                        </v-col>

                        <!-- レーダーチャート -->
                        <v-col v-for="(label, index ) in labels" :key="label" cols="2">
                            <v-text-field v-model="labelData[index]" :label="label" @change="fillData"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <RadarChart :chartData="chartData" class="chart-container"/>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-row>
                        <v-col cols="6" sm="3" md="2">
                            <v-btn block color="red darken-3" @click="generateImageKraken">クラーケン用</v-btn>
                        </v-col>
                        <v-col cols="6" sm="3" md="2">
                            <v-btn block color="purple darken-4" @click="generateImageOrca">オルカ用</v-btn>
                        </v-col>
                        <v-col cols="6" sm="3" md="2">
                            <v-btn block color="blue darken-2" @click="generateImageLeagueStart">リーグスタート用</v-btn>
                        </v-col>
                        <v-col cols="6" sm="3" md="2">
                            <v-btn block color="secondary" @click="generateImageFinish">シーズン終了証書</v-btn>
                        </v-col>
                    </v-row>
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
import * as DataConst from "@/consts/dataConst";
import {WEAPONS} from "@/consts/weaponsConst";
import RadarChart from "@/components/radar_chart.vue";

const allWeaponsData = WEAPONS.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
})
const inputPlayerName = ref([])
const selectPlayerWeapons = ref({})
const selectRange = ref([])
const selectRole = ref([])
const inputTeamName = ref('')
const inputComment = ref('')
const inputAchievements = ref([])
const inputEntryLine = ref('')

const inputFinalWP = ref('')
const inputBestWP = ref('')
const inputRank = ref('')
const inputSeason = ref('')

const logoImage = ref()
const defaultLogo = ref()
const rankIcon = ref()

const imageDataURL = ref()
const imageName = ref('generated_image.png')

const canvasWidth = ref(1920)
const canvasHeight = ref(1080)

// フォルダパス
const roleIconPath = ref('/ink-wave-test/role_icon/')
const defaultLogoPath = ref('/ink-wave-test/default_logo/')
const rankIconPath = ref('/ink-wave-test/rank_icon/')
const weaponsIconPath = ref('/ink-wave-test/weapons/')

const rangeData = DataConst.RANGE
const roleData = DataConst.ROLE
const logoData = DataConst.LOGO_DATA
const rankIconData = DataConst.RANK_ICON

// チャート用データ
const labelData = ref([0, 0, 0, 0, 0, 0])
const labels = ref(['打開', '抑え', 'ライン管理', 'ゲームスピード', '爆発力', '塗り'])
const chartData = ref({
    labels: labels.value,
    datasets: [
        {
            label: 'data',
            fill: true,
            backgroundColor: 'rgba(225, 49, 106, 0.5)',
            borderColor: 'rgb(225, 49, 106)',
            pointBackgroundColor: 'rgb(225, 49, 106)',
            data: labelData.value
        },
    ]
})

const canvas = ref()
const radarCanvas = ref()
const context = ref()

const selectLogo = computed(() => {
    const logo = logoData.find(logo => logo.id === defaultLogo.value);
    if (logo) {
        return defaultLogoPath.value + logo.image + '.png'
    } else {
        return null
    }
})

const selectRankIcon = computed(() => {
    const logo = rankIconData.find(logo => logo.id === rankIcon.value);
    if (logo) {
        return rankIconPath.value + logo.image + '.png'
    } else {
        return null
    }
})

const menuProps = computed(() => {
    return {
        // メニューの高さを指定し、選択肢が縦に伸びるようにします
        maxHeight: '600',
    };
})

onMounted(() => {
    fillData()
    if (localStorage.getItem('labels') != null) {
        labels.value = JSON.parse(localStorage.getItem('labels')!);
    }
})

watch(
    () => labels,
    () => {
        fillData()
        console.log(labels);
        localStorage.setItem('labels', JSON.stringify(labels.value));
    },
    { deep: true }
)

watch(
    () => labelData,
    () => {
        fillData()
    },
    { deep: true }
)

const fillData = (): void => {
    chartData.value = {
        labels: labels.value,
        datasets: [
            {
                label: 'data',
                fill: true,
                backgroundColor: 'rgba(225, 49, 106, 0.5)',
                borderColor: 'rgb(225, 49, 106)',
                pointBackgroundColor: 'rgb(225, 49, 106)',
                data: labelData.value
            },
        ]
    }
}

// クラーケン用
const generateImageKraken = async (): Promise<Boolean> => {
    canvas.value = document.querySelector('#imageCanvas');
    radarCanvas.value = document.querySelector('#radarCanvas');

    if (!canvas || !canvas.value.getContext) return false;
    if (!radarCanvas || !radarCanvas.value.getContext) return false;

    const ctx1 = canvas.value.getContext('2d');
    const ctx2 = radarCanvas.value.getContext('2d');

    const baseImage = new Image();
    baseImage.src = DataConst.TEAM_IMAGE_KRAKEN;

    let issetImage = Array.isArray(logoImage.value) && logoImage.value[0] !== undefined

    baseImage.onload = () => {
        ctx1.drawImage(baseImage, 0, 0, canvasWidth.value, canvasHeight.value);
        ctx1.drawImage(ctx2.canvas, 1187 + 60 + 15, 315 + 74 - 20, radarCanvas.value.width, radarCanvas.value.height); // radarCanvasではなくctx2.canvasを使用

        // Draw text
        ctx1.fillStyle = 'white';

        // チームロゴ
        const maxWidth = 380;
        const maxHeight = 380;
        const landing = 55;
        const top = 50;
        const logo = new Image();
        if ((issetImage && logoImage.value && logoImage.value[0].type && logoImage.value[0].type.match('image/')) || defaultLogo.value) {
            if (issetImage && logoImage.value && logoImage.value[0].type && logoImage.value[0].type.match('image/')) {
                logo.src = URL.createObjectURL(logoImage.value[0]); // ファイルからURLを生成
            } else {
                logo.src = selectLogo.value;
            }

            logo.onload = () => {
                let logoWidth = maxWidth;
                let logoHeight = maxHeight;
                // 比率が1:1の場合
                if (logo.width === logo.height) {
                    logoWidth = logo.width <= maxWidth ? logo.width : maxWidth;
                    logoHeight = logo.height <= maxHeight ? logo.height : maxHeight;
                } else if (logo.width > logo.height) { // ヨコが長い
                    logoWidth = logo.width <= maxWidth ? logo.width : maxWidth;
                    const ratio = logo.width / logoWidth;
                    logoHeight = logo.height / ratio;
                } else { // タテが長い
                    logoHeight = logo.height <= maxHeight ? logo.height : maxHeight;
                    const ratio = logo.height / logoHeight;
                    logoWidth = logo.width / ratio;
                }

                const x = (maxWidth + landing - logoWidth) / 2 + landing / 2;
                const y = (maxHeight + top - logoHeight) / 2 + top / 2;
                ctx1.drawImage(logo, x, y, logoWidth, logoHeight);
                if (issetImage && logoImage.value && logoImage.value[0].type && logoImage.value[0].type.match('image/')) URL.revokeObjectURL(logo.src); // 不要になったURLを解放
                imageDataURL.value = canvas.value.toDataURL();
            }
        }

        // TEAM
        ctx1.font = "bold 50px 'Noto Sans JP', sans-serif";
        ctx1.fillText(inputTeamName.value, 512, 123);

        // MEMBER
        ctx1.font = "bold 26px 'Noto Sans JP', sans-serif";
        inputPlayerName.value.forEach(function (name, index) {
            ctx1.fillText(name, 86, 563 + (index * 106));
        })

        // RANGE
        selectRange.value.forEach(function (rangeId, index) {
            const range = rangeData.find(item => item.id === rangeId);
            const left = 378;
            const x = (180 + left - ctx1.measureText(range.name).width) / 2 + left / 2;
            ctx1.fillText(range.name, x, 563 + (index * 106));
        })

        // ROLE
        selectRole.value.forEach(function (roleTag, index) {
            const role = roleData.find(item => item.tag === roleTag);
            ctx1.fillText(role.name, 617, 563 + (index * 106));
            const roleIcon = new Image();
            roleIcon.src = roleIconPath.value + roleTag + '.png';
            roleIcon.onload = () => {
                ctx1.drawImage(roleIcon, 565, 527 + (index * 106), 50, 50);
                imageDataURL.value = canvas.value.toDataURL();
            }
        })

        // 使用ブキ
        for (const key in selectPlayerWeapons.value) {
            const weapons = selectPlayerWeapons.value[key];
            weapons.forEach(function (fileName, index) {
                const icon = new Image();
                icon.src = weaponsIconPath.value + fileName;
                icon.onload = () => {
                    ctx1.drawImage(icon, 924 + (index * 80), 510 + (key * 106), 75, 75);
                    imageDataURL.value = canvas.value.toDataURL();
                }
            })
        }

        // 実績
        ctx1.font = "bold 28px 'Noto Sans JP', sans-serif";
        inputAchievements.value.forEach(function (achievements, index) {
            ctx1.fillText(achievements, 1238, 115 + (index * 60));
        })

        // COMMENT
        ctx1.font = "bold 20px 'Noto Sans JP', sans-serif";
        const n2Array = inputComment.value.split('\n');
        const lines = [];
        const lineHeight = 50;
        n2Array.forEach((element) => {
            for (let i = 0; i < element.length; i += 29) {
                lines.push(element.slice(i, i + 29));
            }
        });

        for (let i = 0; i < (lines.length > 5 ? 5 : lines.length); i++) {
            ctx1.fillText(lines[i], 509, 239 + (i * lineHeight));
        }

        imageDataURL.value = canvas.value.toDataURL();
    }
}

// オルカ用
const generateImageOrca = async (): Promise<Boolean> => {
    canvas.value = document.querySelector('#imageCanvas');
    radarCanvas.value = document.querySelector('#radarCanvas');

    if (!canvas || !canvas.value.getContext) return false;
    if (!radarCanvas || !radarCanvas.value.getContext) return false;

    context.value = canvas.value.getContext('2d')
    const ctx2 = radarCanvas.value.getContext('2d');

    const baseImage = new Image();
    baseImage.src = DataConst.TEAM_IMAGE_ORCA;

    let issetImage = Array.isArray(logoImage.value) && logoImage.value[0] !== undefined

    baseImage.onload = () => {
        context.value.drawImage(baseImage, 0, 0, canvasWidth.value, canvasHeight.value);
        context.value.drawImage(ctx2.canvas, 1187 + 60 + 15, 315 + 74 - 20, radarCanvas.value.width, radarCanvas.value.height); // radarCanvasではなくctx2.canvasを使用

        // Draw text
        context.value.fillStyle = 'white';

        // チームロゴ
        const maxWidth = 380;
        const maxHeight = 380;
        const landing = 55;
        const top = 50;
        const logo = new Image();
        if ((issetImage && logoImage.value[0] && logoImage.value[0].type && logoImage.value[0].type.match('image/')) || defaultLogo.value) {
            if (issetImage && logoImage.value[0] && logoImage.value[0].type && logoImage.value[0].type.match('image/')) {
                logo.src = URL.createObjectURL(logoImage.value[0]); // ファイルからURLを生成
            } else {
                logo.src = selectLogo.value;
            }

            logo.onload = () => {
                let logoWidth = maxWidth;
                let logoHeight = maxHeight;
                // 比率が1:1の場合
                if (logo.width === logo.height) {
                    logoWidth = logo.width <= maxWidth ? logo.width : maxWidth;
                    logoHeight = logo.height <= maxHeight ? logo.height : maxHeight;
                } else if (logo.width > logo.height) { // ヨコが長い
                    logoWidth = logo.width <= maxWidth ? logo.width : maxWidth;
                    const ratio = logo.width / logoWidth;
                    logoHeight = logo.height / ratio;
                } else { // タテが長い
                    logoHeight = logo.height <= maxHeight ? logo.height : maxHeight;
                    const ratio = logo.height / logoHeight;
                    logoWidth = logo.width / ratio;
                }

                const x = (maxWidth + landing - logoWidth) / 2 + landing / 2;
                const y = (maxHeight + top - logoHeight) / 2 + top / 2;
                context.value.drawImage(logo, x, y, logoWidth, logoHeight);
                if (issetImage && logoImage.value && logoImage.value[0].type && logoImage.value[0].type.match('image/')) URL.revokeObjectURL(logo.src); // 不要になったURLを解放
                imageDataURL.value = canvas.value.toDataURL();
            }
        }

        // TEAM
        context.value.font = "bold 50px 'Noto Sans JP', sans-serif";
        context.value.fillText(inputTeamName.value, 512, 123);

        // MEMBER
        context.value.font = "bold 26px 'Noto Sans JP', sans-serif";
        inputPlayerName.value.forEach(function (name, index) {
            context.value.fillText(name, 86, 563 + (index * 106));
        })

        // RANGE
        const self = this;
        selectRange.value.forEach(function (rangeId, index) {
            const range = rangeData.find(item => item.id === rangeId);
            const left = 378;
            const x = (180 + left - context.value.measureText(range.name).width) / 2 + left / 2;
            context.value.fillText(range.name, x, 563 + (index * 106));
        })

        // ROLE
        selectRole.value.forEach(function (roleTag, index) {
            const role = roleData.find(item => item.tag === roleTag);
            context.value.fillText(role.name, 617, 563 + (index * 106));
            const roleIcon = new Image();
            roleIcon.src = roleIconPath.value + roleTag + '.png';
            roleIcon.onload = () => {
                context.value.drawImage(roleIcon, 565, 527 + (index * 106), 50, 50);
                imageDataURL.value = canvas.value.toDataURL();
            }
        })

        // 使用ブキ
        for (const key in selectPlayerWeapons.value) {
            const weapons = selectPlayerWeapons.value[key];
            weapons.forEach(function (fileName, index) {
                const icon = new Image();
                icon.src = weaponsIconPath.value + fileName;
                icon.onload = () => {
                    context.value.drawImage(icon, 924 + (index * 80), 510 + (key * 106), 75, 75);
                    imageDataURL.value = canvas.value.toDataURL();
                }
            })
        }

        // 実績
        context.value.font = "bold 28px 'Noto Sans JP', sans-serif";
        inputAchievements.value.forEach(function (achievements, index) {
            context.value.fillText(achievements, 1238, 115 + (index * 60));
        })

        // COMMENT
        context.value.font = "bold 20px 'Noto Sans JP', sans-serif";
        const n2Array = inputComment.value.split('\n');
        const lines = [];
        const lineHeight = 50;
        n2Array.forEach((element) => {
            for (let i = 0; i < element.length; i += 29) {
                lines.push(element.slice(i, i + 29));
            }
        });

        for (let i = 0; i < (lines.length > 5 ? 5 : lines.length); i++) {
            context.value.fillText(lines[i], 509, 239 + (i * lineHeight));
        }

        imageDataURL.value = canvas.value.toDataURL();
    }
}

// リーグスタート用
const generateImageLeagueStart = async (): Promise<Boolean> => {
    canvas.value = document.querySelector('#imageCanvas');
    if (!canvas.value || !canvas.value.getContext) return false;
    context.value = canvas.value.getContext('2d')

    const baseImage = new Image();
    baseImage.src = DataConst.TEAM_IMAGE_START;

    let issetImage = Array.isArray(logoImage.value) && logoImage.value[0] !== undefined

    baseImage.onload = () => {
        canvas.value.width = canvasWidth.value; // Canvasの幅を設定
        canvas.value.height = canvasHeight.value; // Canvasの高さを設定
        context.value.drawImage(baseImage, 0, 0, canvasWidth.value, canvasHeight.value);

        // チームロゴ
        const maxWidth = 585;
        const maxHeight = 585;
        const landing = 50;
        const top = 272;
        const logo = new Image();
        if ((issetImage && logoImage.value && logoImage.value[0].type && logoImage.value[0].type.match('image/')) || defaultLogo.value) {
            if (issetImage && logoImage.value && logoImage.value[0].type && logoImage.value[0].type.match('image/')) {
                logo.src = URL.createObjectURL(logoImage.value[0]); // ファイルからURLを生成
            } else {
                logo.src = selectLogo.value;
            }

            logo.onload = () => {
                let logoWidth = maxWidth;
                let logoHeight = maxHeight;
                // 比率が1:1の場合
                if (logo.width === logo.height) {
                    logoWidth = logo.width <= maxWidth ? logo.width : maxWidth;
                    logoHeight = logo.height <= maxHeight ? logo.height : maxHeight;
                } else if (logo.width > logo.height) { // ヨコが長い
                    logoWidth = logo.width <= maxWidth ? logo.width : maxWidth;
                    const ratio = logo.width / logoWidth;
                    logoHeight = logo.height / ratio;
                } else { // タテが長い
                    logoHeight = logo.height <= maxHeight ? logo.height : maxHeight;
                    const ratio = logo.height / logoHeight;
                    logoWidth = logo.width / ratio;
                }

                const x = (maxWidth + landing - logoWidth) / 2 + landing / 2;
                const y = (maxHeight + top - logoHeight) / 2 + top / 2;
                context.value.drawImage(logo, x, y, logoWidth, logoHeight);
                if (issetImage && logoImage.value && logoImage.value[0].type && logoImage.value[0].type.match('image/')) URL.revokeObjectURL(logo.src); // 不要になったURLを解放
                imageDataURL.value = canvas.value.toDataURL();
            }
        }

        context.value.fillStyle = 'white';

        // TEAM
        context.value.font = "bold 60px 'Noto Sans JP', sans-serif";
        context.value.fillText(inputTeamName.value, 732, 280);

        // MEMBER
        context.value.font = "bold 26px 'Noto Sans JP', sans-serif";
        inputPlayerName.value.forEach(function (name, index) {
            context.value.fillText(name, 714, 423 + (index * 106));
        })

        // RANGE
        const self = this;
        selectRange.value.forEach(function (rangeId, index) {
            const range = rangeData.find(item => item.id === rangeId);
            const left = 1004;
            const x = (180 + left - context.value.measureText(range.name).width) / 2 + left / 2;
            context.value.fillText(range.name, x, 423 + (index * 106));
        })

        // ROLE
        selectRole.value.forEach(function (roleTag, index) {
            const role = roleData.find(item => item.tag === roleTag);
            context.value.fillText(role.name, 1244, 423 + (index * 106));
            const roleIcon = new Image();
            roleIcon.src = roleIconPath.value + roleTag + '.png';
            roleIcon.onload = () => {
                context.value.drawImage(roleIcon, 1191, 386 + (index * 106), 50, 50);
                imageDataURL.value = canvas.value.toDataURL();
            }
        })

        // 使用ブキ
        for (const key in selectPlayerWeapons.value) {
            const weapons = selectPlayerWeapons.value[key];
            weapons.forEach(function (fileName, index) {
                const icon = new Image();
                icon.src = weaponsIconPath.value + fileName;
                icon.onload = () => {
                    context.value.drawImage(icon, 1568 + (index * 80), 369 + (key * 106), 75, 75);
                    imageDataURL.value = canvas.value.toDataURL();
                }
            })
        }
    }
    imageDataURL.value = canvas.value.toDataURL();
}

// シーズン終了証書
const generateImageFinish = async (): Promise<Boolean> => {
    canvas.value = document.querySelector('#imageCanvas');
    if (!canvas.value || !canvas.value.getContext) return false;
    context.value = canvas.value.getContext('2d')

    const baseImage = new Image();
    baseImage.src = DataConst.TEAM_IMAGE_FINISH

    baseImage.onload = () => {
        context.value.drawImage(baseImage, 0, 0, canvasWidth.value, canvasHeight.value);

        // Draw text
        context.value.fillStyle = 'white';

        // チームロゴ
        const maxWidth = 470;
        const maxHeight = 470;
        const landing = 110;
        const top = 207;

        const logo = new Image();
        let issetImage = Array.isArray(logoImage.value) && logoImage.value[0] !== undefined
        if ((issetImage && logoImage.value && logoImage.value[0].type && logoImage.value[0].type.match('image/')) || defaultLogo.value) {
            if (issetImage && logoImage.value && logoImage.value[0].type && logoImage.value[0].type.match('image/')) {
                logo.src = URL.createObjectURL(logoImage.value[0]); // ファイルからURLを生成
            } else {
                logo.src = selectLogo.value;
            }

            logo.onload = () => {
                let logoWidth = maxWidth;
                let logoHeight = maxHeight;
                // 比率が1:1の場合
                if (logo.width === logo.height) {
                    logoWidth = logo.width <= maxWidth ? logo.width : maxWidth;
                    logoHeight = logo.height <= maxHeight ? logo.height : maxHeight;
                } else if (logo.width > logo.height) { // ヨコが長い
                    logoWidth = logo.width <= maxWidth ? logo.width : maxWidth;
                    const ratio = logo.width / logoWidth;
                    logoHeight = logo.height / ratio;
                } else { // タテが長い
                    logoHeight = logo.height <= maxHeight ? logo.height : maxHeight;
                    const ratio = logo.height / logoHeight;
                    logoWidth = logo.width / ratio;
                }

                const x = (maxWidth + landing - logoWidth) / 2 + landing / 2;
                const y = (maxHeight + top - logoHeight) / 2 + top / 2;
                context.value.drawImage(logo, x, y, logoWidth, logoHeight);
                if (issetImage && logoImage.value && logoImage.value[0].type && logoImage.value[0].type.match('image/')) URL.revokeObjectURL(logo.src); // 不要になったURLを解放
                imageDataURL.value = canvas.value.toDataURL();

                // ランクアイコン
                if (rankIcon.value) {
                    const icon = new Image();
                    icon.src = selectRankIcon.value;
                    icon.onload = () => {
                        context.value.drawImage(icon, 243 - 33, 673, 270, 270);

                        // 順位
                        context.value.font = "bold 20px 'Noto Sans JP', sans-serif";
                        const left = 330;
                        const x = (29 + left - context.value.measureText(inputRank.value).width) / 2 + left / 2;
                        context.value.fillText(inputRank.value, x, 886);

                        imageDataURL.value = canvas.value.toDataURL();
                    }
                }
            }
        }

        // TEAM
        context.value.font = "bold 50px 'Noto Sans JP', sans-serif";
        context.value.fillText(inputTeamName.value, 682, 230);

        // MEMBER
        context.value.font = "bold 28px 'Noto Sans JP', sans-serif";
        inputPlayerName.value.forEach(function (name, index) {
            context.value.fillText(name, 706, 377 + (index * 106));
        })

        // RANGE
        const self = this;
        selectRange.value.forEach(function (rangeId, index) {
            const range = rangeData.find(item => item.id === rangeId);
            const left = 971;
            const x = (180 + left - context.value.measureText(range.name).width) / 2 + left / 2;
            context.value.fillText(range.name, x, 374 + (index * 106));
        })

        // ROLE
        selectRole.value.forEach(function (roleTag, index) {
            const role = roleData.find(item => item.tag === roleTag);
            context.value.fillText(role.name, 1223, 374 + (index * 106));
            const roleIcon = new Image();
            roleIcon.src = roleIconPath.value + roleTag + '.png';
            roleIcon.onload = () => {
                context.value.drawImage(roleIcon, 1171, 339 + (index * 106), 50, 50);
                imageDataURL.value = canvas.value.toDataURL();
            }
        })

        // 使用ブキ
        for (const key in selectPlayerWeapons.value) {
            const weapons = selectPlayerWeapons.value[key];
            weapons.forEach(function (fileName, index) {
                const icon = new Image();
                icon.src = weaponsIconPath.value + fileName;
                icon.onload = () => {
                    context.value.drawImage(icon, 1560 + (index * 95), 322 + (key * 106), 85, 85);
                    imageDataURL.value = canvas.value.toDataURL();
                }
            })
        }

        // 最高WP
        context.value.font = "bold 50px 'Noto Sans JP', sans-serif";
        let left = 174;
        let x = (155 + left - context.value.measureText(inputBestWP.value).width) / 2 + left / 2;
        context.value.fillText(inputBestWP.value, x, 170);

        // 最終WP
        left = 359;
        x = (159 + left - context.value.measureText(inputFinalWP.value).width) / 2 + left / 2;
        context.value.fillText(inputFinalWP.value, x, 170);

        // シーズン
        context.value.font = "58px 'Lato', sans-serif";
        context.value.fillText(inputSeason.value, 1180, 962);

        imageDataURL.value = canvas.value.toDataURL();
    }
}

const inputData = (): void => {
    let splitData = [];
    if (inputEntryLine.value) {
        splitData = inputEntryLine.value.split('\t');

        inputPlayerName.value = []
        selectPlayerWeapons.value = []
        selectRange.value = []
        selectRole.value = []

        if (splitData.length > 31) {
            inputTeamName.value = splitData[1]
            inputPlayerName.value.push(splitData[5], splitData[11], splitData[16], splitData[21])
            selectRange.value.push(getRange(splitData[9]), getRange(splitData[14]), getRange(splitData[19]), getRange(splitData[24]))
            selectRole.value.push(getRole(splitData[10]), getRole(splitData[15]), getRole(splitData[20]), getRole(splitData[25]))

            // スーパーサブの追加
            if (splitData[27] !== '') {
                inputPlayerName.value.push(splitData[27])
                selectRange.value.push(getRange(splitData[30]))
                selectRole.value.push(getRole(splitData[31]))
            }

            // ブキ
            const startIndex = 32; // 開始インデックス
            const endIndex = 46;   // 終了インデックス
            const chunkSize = 3;
            for (let i = startIndex; i <= endIndex; i++) {
                const relativeIndex = i - startIndex;
                const groupIndex = Math.floor(relativeIndex / chunkSize);
                if (!selectPlayerWeapons.value[groupIndex]) {
                    selectPlayerWeapons.value[groupIndex] = [];
                }
                if (splitData[i]) {
                    const weapon = getWeapon(splitData[i]);
                    if (!selectPlayerWeapons.value[groupIndex].includes(weapon)) {
                        selectPlayerWeapons.value[groupIndex].push(weapon);
                    }
                }
            }

            if (splitData[3] !== "") {
                // this.logoImage = splitData[3]
            } else {
                defaultLogo.value = getDefaultLog(splitData[4])
            }

            rankIcon.value = getRankIcon(splitData[47])
            inputBestWP.value = splitData[48]
            inputFinalWP.value = splitData[49]
            inputRank.value = splitData[50]
            inputSeason.value = splitData[51]
        }
    }
}

const getRankIcon = (rank: string):number | null => {
    switch (rank) {
        case 'クラーケン':
            return 1
        case 'オルカ':
            return 2
        case 'シャーク':
            return 3
        case 'モレイ':
            return 4
        case 'マンタ':
            return 5
        case 'ペンギン':
            return 6
        case 'ジェリーフィッシュ':
            return 7
        default:
            return null
    }
}

const getRange = (range: string):number | null => {
    switch (range) {
        case 'SHORT':
            return 1
        case 'MIDDLE':
            return 2
        case 'LONG':
            return 3
        default:
            return null
    }
}

const getRole = (role: string):string | null => {
    switch (role) {
        case 'アタッカー':
            return 'attack'
        case 'サポーター':
            return 'support'
        case 'コントローラー':
            return 'control'
        case 'タンカー':
            return 'tank'
        case 'メガホンランナー':
            return 'runner'
        case 'バランサー':
            return 'balance'
        default:
            return null
    }
}

const getDefaultLog = (logo: string):number | null => {
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
            return null
    }
}

const getWeapon = (value: string):string | null => {
    const data = allWeaponsData.find(weapon => weapon.name === value);
    if (data) {
        return data.filename
    } else {
        return null
    }
}
</script>

<style scoped>
.confirm-image {
    width: 100%;
    height: auto;
}

.menuable__content__active {
    max-height: 650px !important;
}
</style>
