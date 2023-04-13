<template>
    <div class="calendar font-iransans"></div>
</template>

<script lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import moment from 'jalali-moment'

export default {
    name: 'UserNotes',

    components: {

    },

    setup(props: any, context: any) {
        onMounted(() => {
            const monthTemplate = () => /* html */`
    <div class="days-title"><div>ش</div><div>ی</div>
    <div>د</div><div>س</div><div>چ</div><div>پ</div>
    <div>ج</div></div><div class="days"></div>`;
            const dpTemplate = () => /* html */`
  <div class="date-picker"><div class="head">
      <button><i class="material-icons pi pi-arrow-right"></i></button>
      <div class='title'><h4>...</h4><div></div></div>
      <button><i class="material-icons pi pi-arrow-left"></i></button>
    </div><div class="month"></div></div>`;

            const calendar: any = document.querySelector('.calendar');
            calendar.innerHTML = dpTemplate();
            const today = moment().locale('fa');
            const currentMonth = today.clone().date(1);
            const vMonth = calendar.querySelector('.month');
            const vTitle = calendar.querySelector('.head .title h4');
            const vTitleEn = calendar.querySelector('.head .title div');
            const manageMonth = (navigate = '') => {
                const month = document.createElement('div');
                month.innerHTML = monthTemplate();
                switch (navigate) {
                    case 'next': currentMonth.add(1, 'months'); break;
                    case 'prev': currentMonth.subtract(1, 'months'); break;
                }
                const fDay = currentMonth.clone();
                const lDay = fDay.clone().date(fDay.daysInMonth());
                vTitle.textContent = fDay.format('MMMM YYYY');
                vTitleEn.textContent = fDay.clone().locale('en').format('MMMM - ') +
                    lDay.clone().locale('en').format('MMMM YYYY');
                const vDays = month.querySelector('.days');
                const addDay = (d: any, disabled = false) => {
                    const vDay = document.createElement('div'),
                        vDayEn = document.createElement('div');
                    vDay.textContent = d.date();

                    ///
                    const index = d.year() + '/' + (d.month() + 1) + '/' + d.date()
                    vDay.addEventListener('click', () => {
                        context.emit("customChange", index)
                    })
                    ///

                    vDay.className = `${d.isSame(today, 'day') ? 'today' : ''} ` +
                        `${disabled ? 'disable' : ''}` + `${d.date() === 3 ? ' event' : ''}`;
                    vDayEn.textContent = d.clone().locale('en').date();
                    vDay.appendChild(vDayEn);
                    vDays!.appendChild(vDay);
                }

                for (let d = fDay.clone().subtract((fDay.day() + 1) % 7, 'days');
                    d.diff(fDay, 'days') <= -1; d.add(1, 'days')) {
                    addDay(d, true)
                }

                for (let d = fDay.clone(); d.diff(lDay, 'days') <= 0; d.add(1, 'days')) {
                    addDay(d)
                }
                for (let d = lDay.clone().add(1, 'days');
                    d.diff(lDay.clone().add(7 - (lDay.day() + 1) % 7, 'days'), 'days') <= -1;
                    d.add(1, 'days')) { addDay(d, true) }
                switch (navigate) {
                    case 'next':
                        vMonth.children[0].classList.add('right')
                        month.classList.add('left'); break;
                    case 'prev':
                        vMonth.children[0].classList.add('left')
                        month.classList.add('right'); break;
                }
                vMonth.appendChild(month);
                setTimeout(() => {
                    month.className = '';
                    vMonth.style.height = month.clientHeight + 'px';
                }, 20);
                if (navigate !== '') { setTimeout(() => vMonth.children[0].remove(), 500) }
            }
            manageMonth();
            const btns = calendar.querySelectorAll('.head button');
            btns[0].addEventListener('click', () => manageMonth('prev'))
            btns[1].addEventListener('click', () => manageMonth('next'))

        })

        return {

        }
    },
}
</script>

<style lang="scss">
$primaryColor: rgb(172, 106, 226);
$width: 550px;
$itemSize: (
    $width) / 7;

.event {
    position: relative;
}

.event:after {
    content: '•';
    color: $primaryColor;
    font-size: 1.4em;
    position: absolute;
    right: 7px;
    top: -2px;
}

.calendar {
    transition: all .3s;
    box-sizing: content-box;
    background-color: #fff;
    border-radius: 15px;
    padding: 20px;
    width: $width;
    overflow: hidden;
    direction: rtl;

    .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .title {
            text-align: center;

            h4 {
                margin: 0;
                font-size: 30px;
            }

            div {
                font-family: 'Sahel';
            }
        }

        button {
            width: $itemSize;
            height: $itemSize;
            outline: none;
            cursor: pointer;
            opacity: .6;
            background-color: transparent;
            border-radius: 20%;
            border: none;

            &:hover {
                background-color: rgb(235, 235, 235
                );
        }

        i {
            vertical-align: middle;
            font-size: 40px;
        }
    }
}
}

.calendar {
    .month {
        position: relative;
        transition: .3s all;
    }

    .month>div {
        transition: .5s all;
        position: absolute;
        left: 0;
        top: 0;

        &.right {
            opacity: 0;
            transform: translateX($width);
        }

        &.left {
            opacity: 0;
            transform: translateX(-$width);
        }
    }

    .month .days-title {
        color: #555;
    }

    .month .days,
    .month .days-title {
        display: flex;
        flex-wrap: wrap;

        &>div {
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: $itemSize;
            height: $itemSize;
            border-radius: 20%;
        }
    }

    .days {
        display: flex;
        flex-wrap: wrap;

        &>div {
            position: relative;
            cursor: pointer;
            box-sizing: border-box;
            transition: .3s all;

            div {
                font-family: 'Sahel';
                font-size: 15px;
                opacity: .5;
                position: absolute;
                left: 8px;
                bottom: 8px;
            }

            &:hover {
                background-color: rgb(235, 235, 235);
            }

            &.today {
                background-color: $primaryColor;
                color: #fff;
            }

            &.disable {
                opacity: .3;
            }
        }
    }
}
</style>