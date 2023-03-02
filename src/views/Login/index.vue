<template>
    <div class="w-screen h-screen flex items-center justify-center">
        <transition name="scaleRight" appear>
            <Card v-if="formValue"
                class="text-center w-full sm:w-8/12 md:w-2/5 h-screen sm:h-fit flex flex-col justify-center items-center sm:border-t-2 border-blue-400 pt-10 pb-6 px-0 sm:px-10">
                <template #header>
                    <Avatar icon="pi pi-user" size="large" class="rounded-lg" />
                </template>
                <template #title>
                    ثبت نام
                </template>
                <template #content>
                    <template v-if="chosechar">
                        <form class="w-full flex flex-col justify-center items-center gap-2.5">
                            <InputText type="text" placeholder="نام کاربری" class="w-10/12 text-sm rounded-lg" />
                            <InputText type="password" placeholder="رمز عبور" class="w-10/12 text-sm rounded-lg" />
                            <InputText type="password" placeholder="تکرار رمز عبور" class="w-10/12 text-sm rounded-lg" />
                            <Button type="button" label="ثبت نام" :loading="false"
                                class="w-10/12 text-sm font-bold rounded-lg" />
                        </form>
                    </template>
                    <template v-else>
                        <div class="flex gap-6 sm:gap-2 justify-center mt-4 mb-3">
                            <Button class="text-sm font-medium rounded-md" label="کارفرما" :loading="false"
                                @click="chosechar = 'کارفرما'" />
                            <Button class="text-sm font-medium rounded-md" label="فریلنسر" :loading="false"
                                @click="chosechar = 'فریلنسر'" />
                        </div>
                    </template>
                </template>
                <template #footer>
                    <p class=" font-IRANSans text-sm">
                        حساب کاربری دارید!
                        <span class="text-blue-700 cursor-pointer" @click="formValue = !formValue">ورود به حساب</span>
                    </p>
                </template>
            </Card>

        </transition>
        <transition name="scaleLeft" appear>
            <Card v-if="!formValue"
                class="text-center w-full sm:w-8/12 md:w-2/5 h-screen sm:h-fit flex flex-col justify-center items-center sm:border-t-2 border-blue-400 pt-10 pb-6 px-0 sm:px-10">
                <template #header>
                    <Avatar icon="pi pi-user" size="large" class="rounded-lg" />
                </template>
                <template #title>
                    ورود
                </template>
                <template #content>
                    <form class="w-full flex flex-col justify-center items-center gap-2.5">
                        <InputText v-model="userName" type="text" placeholder="نام کاربری"
                            class="w-10/12 text-sm rounded-lg" />
                        <InputText type="password" placeholder="رمز عبور" class="w-10/12 text-sm rounded-lg" />
                        <Button type="button" label="ورود" :loading="false" class="w-10/12 text-sm font-bold rounded-lg"
                            :disabled="!(userName.length > 0)" @click="goPanel" />
                    </form>
                </template>
                <template #footer>
                    <p class="font-IRANSans text-sm">
                        حساب کاربری ندارید؟
                        <span class="text-blue-700 cursor-pointer" @click="formValue = !formValue">ثبت نام کنید</span>
                    </p>
                </template>
            </Card>
        </transition>
    </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

export default {
    name: 'LoginPage',

    components: {
        Card,
        Avatar,
        InputText,
        Button
    },

    setup() {
        const formValue = ref(false)
        const chosechar = ref('')
        const userName = ref('')
        const router = useRouter()

        function goPanel() {
            router.push({
                name: "UserPanel"
            });
        }

        watch(formValue, () => {
            chosechar.value = ''
        })

        return {
            formValue,
            userName,
            goPanel,
            chosechar
        }
    },
}
</script>

<style lang="scss">
.p-card {
    @apply font-yekan shadow-2xl sm:rounded-2xl;

    .p-card-body {
        @apply w-full;
    }
}

.p-inputtext {
    @apply font-yekan;
}

.p-button {
    @apply font-yekan;
}

.scaleLeft-enter-active,
.scaleRight-enter-active {
    transition: all 0.7s ease;
}

.scaleLeft-leave-active,
.scaleRight-leave-active {
    transition: all 0.6s ease;
}

.scaleRight-enter-from,
.scaleRight-leave-to {
    z-index: 5;
    opacity: 0;
    transform: rotateY(-180deg);
    position: absolute;
}

.scaleRight-leave-from {
    opacity: 0;
}

.scaleLeft-enter-from,
.scaleLeft-leave-to {
    z-index: 5;
    opacity: 0;
    transform: rotateY(180deg);
    position: absolute;
}

.scaleLeft-leave-from {
    opacity: 0;
}
</style>

