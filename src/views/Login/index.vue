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
                    <InlineMessage v-if="registerError" severity="error">لطفا در وارد کردن اطلاعات بیشتر دقت کنید
                    </InlineMessage>
                    <InlineMessage v-if="loginError" severity="error">ورود به سایت با مشکل مواجه شد لطفا دوباره تلاش کنید
                    </InlineMessage>
                    <template v-if="chosechar">
                        <form class="w-full flex flex-col justify-center items-center gap-2.5">
                            <InputText v-model="firstNameR" type="text" placeholder="نام" class="w-10/12 text-sm rounded-lg"
                                @keyup.enter="register" />

                            <InputText v-model="lastNameR" type="text" placeholder="نام خانوادگی"
                                class="w-10/12 text-sm rounded-lg" @keyup.enter="register" />

                            <InputText v-model="userNameR" type="text" placeholder="نام کاربری"
                                class="w-10/12 text-sm rounded-lg" @keyup.enter="register" />

                            <InputText v-model="emailR" type="text" placeholder="ایمیل" class="w-10/12 text-sm rounded-lg"
                                @keyup.enter="register" />


                            <!-- <InputMask v-model="phoneR" mask="9999-9999999" dir="ltr" /> -->

                            <InputText v-model="phoneR" type="number" placeholder="شماره همراه"
                                class="w-10/12 text-sm rounded-lg" @keyup.enter="register" />



                            <InputNumber v-model="ageR" showButtons dir="ltr" inputClass="w-16" :min="0"
                                class="rounded-lg overflow-hidden" @keyup.enter="register" />

                            <!-- <InputText v-model="passwordR" type="password" placeholder="رمز عبور"
                                class="w-10/12 text-sm rounded-lg" /> -->

                            <Password v-model="passwordR">
                                <template #footer>
                                    <Divider />
                                    <p class="mt-2">پیشنهادات</p>
                                    <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                        <li>حداقل 9 کارکتر وارد کنید</li>
                                    </ul>
                                </template>
                            </Password>

                            <Password v-model="passwordRR">
                                <template #footer>
                                    <Divider />
                                    <p class="mt-2">پیشنهادات</p>
                                    <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                        <li>حداقل 9 کارکتر وارد کنید</li>
                                    </ul>
                                </template>
                            </Password>

                            <Button type="button" label="ثبت نام" :loading="profileLoading"
                                :disabled="passwordR !== passwordRR || userNameR.length === 0"
                                class="w-10/12 text-sm font-bold rounded-lg" @click="register" />
                        </form>
                    </template>
                    <template v-else>
                        <div class="flex gap-6 sm:gap-2 justify-center mt-4 mb-3">
                            <Button class="text-sm font-medium rounded-md" label="کارفرما"
                                @click="chosechar = 'employer'" />
                            <Button class="text-sm font-medium rounded-md" label="فریلنسر"
                                @click="chosechar = 'freelancer'" />
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
                    <InlineMessage v-if="loginError" severity="error" class="mb-2">ورود به سایت با مشکل مواجه شد لطفا دوباره
                        تلاش کنید
                    </InlineMessage>
                    <form class="w-full flex flex-col justify-center items-center gap-2.5">
                        <InputText v-model="userNameL" type="text" placeholder="نام کاربری"
                            class="w-10/12 text-sm rounded-lg" @keyup.enter="login" />
                        <InputText v-model="passwordL" type="password" placeholder="رمز عبور"
                            class="w-10/12 text-sm rounded-lg" @keyup.enter="login" />
                        <Button type="button" label="ورود" :loading="profileLoading"
                            class="w-10/12 text-sm font-bold rounded-lg" :disabled="!(userNameL.length > 0)"
                            @click="login" />
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
import { computed, ref, watch } from 'vue'
import { useProfileStore } from '@/store/profileStore';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Password from 'primevue/password';
import InlineMessage from 'primevue/inlinemessage';
// import InputMask from 'primevue/inputmask';

export default {
    name: 'LoginPage',

    components: {
        InputNumber,
        InlineMessage,
        Card,
        Avatar,
        InputText,
        Button,
        Password,
        // InputMask,
    },

    setup() {
        const router = useRouter()
        const profileStore = useProfileStore()

        const passwordL = ref('')
        const passwordR = ref('')
        const passwordRR = ref('')
        const userNameR = ref('')
        const firstNameR = ref('')
        const lastNameR = ref('')
        const emailR = ref('')
        const phoneR = ref('')
        const ageR = ref(0)
        const chosechar = ref('')
        const userNameL = ref('')
        const formValue = ref(false)
        const registerError = ref(false)
        const loginError = ref(false)

        const profileLoading = computed(() => profileStore.loading)

        function goPanel() {
            router.push({
                name: "UserPanel"
            });
        }

        watch(formValue, () => {
            chosechar.value = ''
            userNameL.value = ''
            userNameR.value = ''
            passwordR.value = ''
            passwordRR.value = ''
            firstNameR.value = ''
            lastNameR.value = ''
            ageR.value = 0
            phoneR.value = ''
            emailR.value = ''
        })

        function register() {
            profileStore.changeLoading(true)
            registerError.value = false
            loginError.value = false
            profileStore.register(userNameR.value, passwordR.value, chosechar.value, firstNameR.value, lastNameR.value, ageR.value, phoneR.value, emailR.value).then(() => {
                profileStore.login(userNameR.value, passwordR.value).then(() => {
                    profileStore.changeLoading(false)
                    router.push({
                        name: "UserPanel"
                    });
                }).catch(() => {
                    profileStore.changeLoading(false)
                    loginError.value = true
                })
            }).catch(() => {
                profileStore.changeLoading(false)
                registerError.value = true
            })
        }

        function login() {
            profileStore.changeLoading(true)
            loginError.value = false
            profileStore.login(userNameL.value, passwordL.value).then(() => {
                profileStore.changeLoading(false)
                router.push({
                    name: "UserPanel"
                });
            }).catch(() => {
                profileStore.changeLoading(false)
                loginError.value = true
            })
        }

        return {
            login,
            register,
            goPanel,
            formValue,
            userNameL,
            chosechar,
            passwordL,
            passwordR,
            passwordRR,
            userNameR,
            firstNameR,
            lastNameR,
            emailR,
            phoneR,
            ageR,
            profileLoading,
            registerError,
            loginError
        }
    },
}
</script>

<style lang="scss">
.p-card {
    // @apply font-yekan shadow-2xl sm:rounded-2xl;

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

