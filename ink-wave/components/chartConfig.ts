export const data = {
    labels: [
        'Eating',
        'Drinking',
        'Sleeping',
        'Designing',
        'Coding',
        'Cycling',
        'Running'
    ],
    datasets: [
        {
            label: 'data',
            fill: true,
            backgroundColor: 'rgba(225, 49, 106, 0.5)',
            borderColor: 'rgb(225, 49, 106)',
            pointBackgroundColor: 'rgb(225, 49, 106)',
            data: [5, 4, 5, 3, 4, 5, 2]
        },
    ]
}

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        r: {
            // 外枠ラベルの設定
            pointLabels: {
                font: {
                    size: 22,
                },
                color: 'white'
            },
            min: 0,
            max: 5,
            ticks: {
                display: false, // メモリ非表示
                stepSize: 1,
            },
            // 外周枠
            grid: {
                color: 'white'
            },
            // 角度線
            angleLines: {
                color: 'white'
            }
        },
    },
    plugins: {
        legend: {
            display: false, // 凡例を非表示にする
        },
    },
}

export const styles = {
    width: `580px`,
    height: `580px`,
    position: 'relative'
}
