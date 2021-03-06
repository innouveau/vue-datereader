import Vue from 'vue';
import Vuex from 'vuex';
import {getDaysInMonth, getDay, getDate, getMonth, getYear} from 'date-fns';

Vue.use(Vuex);

const today = new Date();

const settings = {
    thisMonth: today.getMonth(),
    thisYear: today.getFullYear(),
};

const getters = {
    getEventDays: (state) => () => {
        let month, days;
        days = [];
        month = state.months[state.currentMonthIndex];
        for (let day of month.days) {
            if (day.events.length > 0) {
                days.push(day);
            }
        }
        return days;
    },
    getMonth: (state) => {
        return state.months[state.currentMonthIndex]
    },
    getFirstMonthWithEvent: (state) => {
        let monthIndex = 0;
        for (let month of state.months) {
            for (let day of month.days) {
                if (day.events.length > 0) {
                    return monthIndex;
                }
            }
            monthIndex ++
        }
        return null;
    }
};



const state = {
    totalMonths: 12,
    months: [],
    currentMonthIndex: 0
};

const actions = {

};

const mutations = {
    init(state) {
        let month, year, monthNames;
        month = settings.thisMonth;
        year = settings.thisYear;

        monthNames = {
            nl: ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December']
        };

        for (let i = 0; i < state.totalMonths; i++) {
            let theMonth, firstDayOfFirstMonth, daysInMonth, dayOfTheWeekOfFirst;

            firstDayOfFirstMonth = new Date(year + '/' + (month + 1) + '/1');
            daysInMonth = getDaysInMonth(firstDayOfFirstMonth);

            dayOfTheWeekOfFirst = getDay(firstDayOfFirstMonth) - 1;
            if (dayOfTheWeekOfFirst === -1) {
                dayOfTheWeekOfFirst = 6;
            }

            theMonth = {
                year: year,
                month: (month + 1),
                monthName: monthNames.nl[month],
                dayOfTheWeekOfFirst: dayOfTheWeekOfFirst,
                daysInMonth: daysInMonth,
                days: []
            };



            for (let d = 0; d < daysInMonth; d++) {
                let date, dayOfTheWeek;
                date = new Date(year + '/' + (month + 1) + '/' + (d + 1));
                dayOfTheWeek = getDay(date);
                theMonth.days.push({
                    date: date,
                    weekend: dayOfTheWeek === 6 || dayOfTheWeek === 0,
                    day: (d+1),
                    events: []
                })
            }

            state.months.push(theMonth);


            month++;
            if (month > 11) {
                month = 0;
                year++;
            }
        }
    },
    addEvent(state, event) {
        let date, day, month, year;
        date = new Date(event.date);
        day = getDate(date);
        month = getMonth(date) + 1;
        year = getYear(date);

        for (let theMonth of state.months) {
            if (theMonth.year === year && theMonth.month === month) {
                theMonth.days[day - 1].events.push(event.event);
            }
        }
    },
    slideNext(state) {
        state.currentMonthIndex++;
    },
    slidePrev(state) {
        state.currentMonthIndex--;
    },
    setMonthIndex(state, monthIndex) {
        state.currentMonthIndex = monthIndex;
    }
};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    strict: true
})

