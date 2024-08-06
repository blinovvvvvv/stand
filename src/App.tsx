import { Button, Flex, Input, Text, useToast } from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'

export const $api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
	},
})

interface Inputs {
	name: string
	title: string
	symbol: string
	decimals: string
	minBuy: string
	maxBuy: string
	minSale: string
	maxSale: string
}

export const App = ({ onClose }: { onClose: () => void }) => {
	const {
		register,
		handleSubmit,
		formState: { isDirty, isValid },
	} = useForm<Inputs>({
		mode: 'onChange',
	})

	const { mutateAsync } = useMutation({
		mutationFn: async (data: Inputs) => {
			return await $api.post('/currency', {
				min_buy_amount: data.minBuy,
				max_buy_amount: data.maxBuy,
				min_sale_amount: data.minSale,
				max_sale_amount: data.maxSale,
				name: data.name,
				title: data.title,
				decimals: data.decimals,
				symbol: data.symbol,
			})
		},
	})

	const queryClient = useQueryClient()
	const toast = useToast()

	const onSubmit: SubmitHandler<Inputs> = async data => {
		await mutateAsync(data)
			.then(res => {
				onClose()
				queryClient.invalidateQueries({
					queryKey: ['currencies'],
				})
				console.log(res)
				if (res) {
					// await uploadIcon(res.data.)
					toast({
						title: 'Currency created.',
						status: 'success',
						duration: 3000,
						isClosable: true,
					})
				}
			})
			.catch(err => {
				if (err)
					toast({
						title: 'Something went wrong.',
						status: 'error',
						duration: 3000,
						isClosable: true,
					})
			})
	}

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				id='my-form'
				className='flex flex-col gap-4'
			>
				<Text fontWeight={500}>Basic Information</Text>
				<div>
					<Text mb={'2px'}>Name</Text>
					<Input
						focusBorderColor='#7367f0'
						{...register('name', {
							required: true,
						})}
					/>
				</div>
				<div>
					<Text mb={'2px'}>Title</Text>
					<Input
						focusBorderColor='#7367f0'
						{...register('title', {
							required: true,
						})}
					/>
				</div>
				<div>
					<Text mb={'2px'}>Symbol</Text>
					<Input
						focusBorderColor='#7367f0'
						{...register('symbol', {
							required: true,
						})}
					/>
				</div>
				<div>
					<Text mb={'2px'}>Decimals</Text>
					<Input
						focusBorderColor='#7367f0'
						{...register('decimals', {
							required: true,
						})}
					/>
				</div>
				<Text fontWeight={500}>Amount</Text>
				<Flex gap={'24px'}>
					<div>
						<Text mb={'2px'}>Min Buy</Text>
						<Input focusBorderColor='#7367f0' {...register('minBuy')} />
					</div>
					<div>
						<Text mb={'2px'}>Min Sale</Text>
						<Input focusBorderColor='#7367f0' {...register('minSale')} />
					</div>
				</Flex>
				<Flex gap={'24px'}>
					<div>
						<Text mb={'2px'}>Max Buy</Text>
						<Input focusBorderColor='#7367f0' {...register('maxBuy')} />
					</div>
					<div>
						<Text mb={'2px'}>Max Sale</Text>
						<Input focusBorderColor='#7367f0' {...register('maxSale')} />
					</div>
				</Flex>
			</form>

			<Button
				type='submit'
				form='my-form'
				isDisabled={!isValid || !isDirty}
				color={'white'}
				_disabled={{
					bgColor: '#808390',
				}}
				bgColor={'#7367f0'}
			>
				Add currency
			</Button>
		</>
	)
}
