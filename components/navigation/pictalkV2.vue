<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<section class="modal-card-body">
                <a href="https://www.pictalk.org/">
				<b-image
      					lazy
      					:srcset="require('@/assets/PictalkV2.png').srcSet"
      					alt="Pictalk version 2 logo"
						style="width: 40%; left: 30%"
    		></b-image></a>
            <h1 class="title">{{ $t('PictalkV2')}}</h1>
					<p class="is-size-5 notification">
						 {{ $t('PictalkV2Text')}}
						<a href="https://www.pictalk.org/">pictalk.org</a>
						 {{ $t('PictalkV2Text2')}}
					</p>
			</section>
			<footer class="modal-card-foot">
                
				<b-button @click="$parent.close()">OK</b-button>
                
                <a href="https://www.pictalk.org/" style="width: 100%">
                <b-button class="is-success" @click="$parent.close()">Pictalk V2</b-button>
                </a>
			</footer>
		</div>
	</form>
</template>


